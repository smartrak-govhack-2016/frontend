interface EventedLayer {
	on(event: string, callback: (e: L.LeafletMouseEvent) => void): void;
	off(event: string, callback: (e: L.LeafletMouseEvent) => void): void;
}

export = class ToolTip {
	div: HTMLDivElement;

	constructor(private layer: EventedLayer) {
		layer.on('mouseover', (e) => this.mouseover(e));
		layer.on('mousemove', (e) => this.mousemove(e));
		layer.on('mouseout', (e) => this.mouseout(e));
	}

	mouseover(e: L.LeafletMouseEvent) {
		this.div = document.createElement('div');
		this.div.className = "dtooltip";
		this.div.innerHTML="blah";
		this.div.style.left = e.originalEvent.clientX + "px";
		this.div.style.top = e.originalEvent.clientY + "px";
		document.getElementById('phaser').appendChild(this.div);
	}
	mousemove(e: L.LeafletMouseEvent) {
		this.div.style.left = e.originalEvent.clientX + "px";
		this.div.style.top = e.originalEvent.clientY + "px";
	}
	mouseout(e: L.LeafletMouseEvent) {
		this.div.remove();
		this.div = null;
	}
};