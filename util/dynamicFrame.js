export class DynamicFrame {
    constructor(title = "Dynamic Frame", width = 400, height = 300) {
        this.isDragging = false;
        this.isResizing = false;
        this.resizeDir = null;
        this.offsetX = 0;
        this.offsetY = 0;
        this.startWidth = 0;
        this.startHeight = 0;
        this.startX = 0;
        this.startY = 0;
        this.dragListeners = [];
        this.resizeListeners = [];

        this.delegate = document.createElement('div');
        Object.assign(this.delegate.style, {
            position: 'fixed',
            top: '100px',
            left: '100px',
            width: `${width}px`,
            height: `${height}px`,
            zIndex: '9999',
            background: '#2a2a2a',
            border: '3px solid #1a1a1a',
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
            userSelect: 'none'
        });

        this.header = document.createElement('div');
        this.header.textContent = title;
        Object.assign(this.header.style, {
            background: '#1a1a1a',
            color: '#fff',
            padding: '6px 10px',
            cursor: 'move',
            flex: '0 0 auto'
        });

        this.content = document.createElement('div');
        Object.assign(this.content.style, {
            flex: '1 1 auto',
            overflow: 'auto',
            padding: '8px'
        });

        this.delegate.appendChild(this.header);
        this.delegate.appendChild(this.content);
        document.body.appendChild(this.delegate);

        this.addResizeHandles();

        this.header.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.offsetX = e.clientX - this.delegate.offsetLeft;
            this.offsetY = e.clientY - this.delegate.offsetTop;
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                const newLeft = e.clientX - this.offsetX;
                const newTop = e.clientY - this.offsetY;
                this.move(newLeft, newTop);
                let size = this.size();
                this.dragListeners.forEach(l => l(newLeft, newTop, size[0], size[1]));
            } else if (this.isResizing && this.resizeDir) {
                this.performResize(e);
            }
        });

        document.addEventListener('mouseup', () => {
            this.isDragging = false;
            this.isResizing = false;
            this.resizeDir = null;
        });

        window.addEventListener('resize', () => {
            const currentLeft = parseInt(this.delegate.style.left, 10);
            const currentTop = parseInt(this.delegate.style.top, 10);
            this.move(currentLeft, currentTop);
        });

    }

    addResizeHandles() {
        const sides = [
            { dir: 'n', top: '-3px', left: '0', width: '100%', height: '6px', cursor: 'n-resize' },
            { dir: 's', bottom: '-3px', left: '0', width: '100%', height: '6px', cursor: 's-resize' },
            { dir: 'e', top: '0', right: '-3px', width: '6px', height: '100%', cursor: 'e-resize' },
            { dir: 'w', top: '0', left: '-3px', width: '6px', height: '100%', cursor: 'w-resize' },
            { dir: 'ne', top: '-3px', right: '-3px', width: '10px', height: '10px', cursor: 'ne-resize' },
            { dir: 'nw', top: '-3px', left: '-3px', width: '10px', height: '10px', cursor: 'nw-resize' },
            { dir: 'se', bottom: '-3px', right: '-3px', width: '10px', height: '10px', cursor: 'se-resize' },
            { dir: 'sw', bottom: '-3px', left: '-3px', width: '10px', height: '10px', cursor: 'sw-resize' },
        ];

        for (const s of sides) {
            const handle = document.createElement('div');
            Object.assign(handle.style, {
                position: 'absolute',
                ...s,
                background: 'transparent',
                zIndex: '10000'
            });
            handle.style.cursor = s.cursor;
            handle.addEventListener('mousedown', (e) => {
                this.isResizing = true;
                this.resizeDir = s.dir;
                this.startX = e.clientX;
                this.startY = e.clientY;
                this.startWidth = this.delegate.offsetWidth;
                this.startHeight = this.delegate.offsetHeight;
                this.startLeft = this.delegate.offsetLeft;
                this.startTop = this.delegate.offsetTop;
                e.preventDefault();
                e.stopPropagation();
            });
            this.delegate.appendChild(handle);
        }
    }

    performResize(e) {
        const dx = e.clientX - this.startX;
        const dy = e.clientY - this.startY;

        let newWidth = this.startWidth;
        let newHeight = this.startHeight;
        let newLeft = this.startLeft;
        let newTop = this.startTop;

        if (this.resizeDir.includes('e')) newWidth = this.startWidth + dx;
        if (this.resizeDir.includes('s')) newHeight = this.startHeight + dy;
        if (this.resizeDir.includes('w')) {
            newWidth = this.startWidth - dx;
            newLeft = this.startLeft + dx;
        }
        if (this.resizeDir.includes('n')) {
            newHeight = this.startHeight - dy;
            newTop = this.startTop + dy;
        }

        this.delegate.style.width = `${Math.max(100, newWidth)}px`;
        this.delegate.style.height = `${Math.max(100, newHeight)}px`;
        this.delegate.style.left = `${newLeft}px`;
        this.delegate.style.top = `${newTop}px`;
    
        this.resizeListeners.forEach(l => l(newLeft, newTop, newWidth, newHeight));
    }

    size() {
        return [
            this.delegate.offsetWidth,
            this.delegate.offsetHeight
        ]
    }

    resize(width, height) {
        this.delegate.style.width = `${width}px`;
        this.delegate.style.height = `${height}px`;
    }

    move(x, y) {
        const size = this.size();
        const frameWidth = size[0];
        const frameHeight = size[1];

        const clampedLeft = Math.max(0, Math.min(x, window.innerWidth - frameWidth));
        const clampedTop = Math.max(0, Math.min(y, window.innerHeight - frameHeight));

        this.delegate.style.left = `${clampedLeft}px`;
        this.delegate.style.top = `${clampedTop}px`;
    }

    clear() {
        this.content.innerHTML = "";
    }

    showElement(element) {
        this.clear();
        this.content.appendChild(element);
    }

    showHtml(html) {
        this.clear();
        this.content.innerHTML = html;
    }

    scale(factor) {
        this.content.style.zoom = factor;
    }

    addDragListener(listener) {
        this.dragListeners.push(listener);
    }

    addResizeListener(listener) {
        this.resizeListeners.push(listener);
    }

}
