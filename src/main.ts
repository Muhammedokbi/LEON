// LEON TypeScript Frontend Core
// This file can be compiled using: tsc main.ts --outFile ../script_ts.js

interface FloatElement {
  el: HTMLSpanElement;
  curX: number;
  curY: number;
}

export class InteractionManager {
  private floatEls: FloatElement[] = [];
  private readonly repulseRadius = 150;
  private readonly repulseForce = 0.8;

  constructor(private containerId: string, private itemCount: number = 40) {}

  public init(): void {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    const nums: string[] = [
      'sudo','apt','pacman','dnf','ls -la','grep','chmod','systemctl','journalctl',
      'mkdir','rm -rf /','tar -xvf','htop','neofetch','tty','chown','top','kill -9',
      'ssh','ping','awk','sed','bash','zsh','root','EOF','/etc/fstab','/var/log',
      'chroot','mount','ifconfig','curl','wget','git','docker'
    ];
    
    for(let i = 0; i < this.itemCount; i++){
      const el = document.createElement('span');
      el.className = 'fnum';
      el.textContent = nums[Math.floor(Math.random() * nums.length)];
      
      const x = Math.random() * 95;
      const y = Math.random() * 95;
      el.style.left = `${x}%`;
      el.style.top = `${y}%`;
      
      this.floatEls.push({ el, curX: 0, curY: 0 });
      container.appendChild(el);
    }

    this.attachMouseEvents();
  }

  private attachMouseEvents(): void {
    document.addEventListener('mousemove', (e: MouseEvent) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      this.floatEls.forEach(item => {
        const rect = item.el.getBoundingClientRect();
        const elX = rect.left + rect.width / 2;
        const elY = rect.top + rect.height / 2;

        const dx = elX - mouseX;
        const dy = elY - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let targetX = 0;
        let targetY = 0;

        if (dist < this.repulseRadius) {
          const force = (this.repulseRadius - dist) / this.repulseRadius;
          targetX = (dx / dist) * force * this.repulseRadius * this.repulseForce;
          targetY = (dy / dist) * force * this.repulseRadius * this.repulseForce;
        }

        item.curX += (targetX - item.curX) * 0.1;
        item.curY += (targetY - item.curY) * 0.1;

        item.el.style.transform = `translate(${item.curX}px, ${item.curY}px)`;
      });
    });
  }
}
