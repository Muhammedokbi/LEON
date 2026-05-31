let floatEls = [];

function initFloatNums() {
  const container = document.getElementById('floatNums');
  const nums = [
    'sudo','apt','pacman','dnf','ls -la','grep','chmod','systemctl','journalctl',
    'mkdir','rm -rf /','tar -xvf','htop','neofetch','tty','chown','top','kill -9',
    'ssh','ping','awk','sed','bash','zsh','root','EOF','/etc/fstab','/var/log',
    'chroot','mount','ifconfig','curl','wget','git','docker'
  ];
  
  for(let i = 0; i < 40; i++){
    const el = document.createElement('span');
    el.className = 'fnum';
    el.textContent = nums[Math.floor(Math.random()*nums.length)];
    const x = Math.random() * 95;
    const y = Math.random() * 95;
    el.style.left = x + '%';
    el.style.top = y + '%';
    
    floatEls.push({
      el: el,
      curX: 0,
      curY: 0
    });
    
    container.appendChild(el);
  }

  // Interactive mouse push effect
  document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const repulseRadius = 150;
    const repulseForce = 0.8;

    floatEls.forEach(item => {
      const rect = item.el.getBoundingClientRect();
      const elX = rect.left + rect.width / 2;
      const elY = rect.top + rect.height / 2;

      const dx = elX - mouseX;
      const dy = elY - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      let targetX = 0;
      let targetY = 0;

      if (dist < repulseRadius) {
        const force = (repulseRadius - dist) / repulseRadius;
        targetX = (dx / dist) * force * repulseRadius * repulseForce;
        targetY = (dy / dist) * force * repulseRadius * repulseForce;
      }

      // Smooth interpolation
      item.curX += (targetX - item.curX) * 0.1;
      item.curY += (targetY - item.curY) * 0.1;

      item.el.style.transform = `translate(${item.curX}px, ${item.curY}px)`;
    });
  });
}
