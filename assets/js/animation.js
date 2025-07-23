// Animation Controller for Puzzle Code
class AnimationController {
    constructor() {
        this.intervals = [];
        this.isInitialized = false;
    }

    // Initialize all animations when DOM is ready
    init() {
        if (this.isInitialized) return;
        
        document.addEventListener('DOMContentLoaded', () => {
            this.initMagicStars();
            this.animateSVGLogo();
            this.animateSVGLine();
            this.isInitialized = true;
        });

        // If DOM is already loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initMagicStars();
                this.animateSVGLogo();
                this.animateSVGLine();
                this.isInitialized = true;
            });
        } else {
            this.initMagicStars();
            this.animateSVGLogo();
            this.animateSVGLine();
            this.isInitialized = true;
        }
    }

    // Animate SVG line drawing effect
    animateSVGLine() {
        const svgLine = document.querySelector('.line');
        if (!svgLine) return;

        // Set up the stroke-dasharray for line drawing animation
        const pathLength = svgLine.getTotalLength ? svgLine.getTotalLength() : 188.5; // fallback value
        
        svgLine.style.strokeDasharray = pathLength;
        svgLine.style.strokeDashoffset = pathLength;

        // Animate the line drawing
        const animateLine = () => {
            svgLine.style.transition = 'stroke-dashoffset 3.8s cubic-bezier(0.455, 0.030, 0.515, 0.955)';
            svgLine.style.strokeDashoffset = '0';
            
            setTimeout(() => {
                svgLine.style.strokeDashoffset = pathLength;
                setTimeout(() => {
                    animateLine();
                }, 150);
            }, 3800);
        };

        // Start animation with delay
        setTimeout(() => {
            animateLine();
        }, 500);
    }

    // Initialize magic stars animation
    initMagicStars() {
        const magicStarElements = document.getElementsByClassName("magic-star");

        Array.from(magicStarElements).forEach((star, index) => {
            this.animateStar(star, index);
        });
    }

    // Animate individual star
    animateStar(star, index) {
        const getRandomPosition = () => {
            const positions = [
                { left: Math.random() * 20 - 10, top: Math.random() * 30 - 40 },
                { left: Math.random() * 20 + 90, top: Math.random() * 30 - 40 },
                { left: Math.random() * 20 - 10, top: Math.random() * 30 + 10 },
                { left: Math.random() * 20 + 90, top: Math.random() * 30 + 10 },
                { left: Math.random() * 60 + 20, top: Math.random() * 20 - 30 },
            ];
            return positions[Math.floor(Math.random() * positions.length)];
        };

        const cycleStar = () => {
            star.style.opacity = '0';
            star.style.transition = 'opacity 0.8s ease-in-out';

            setTimeout(() => {
                const newPos = getRandomPosition();
                star.style.setProperty("--star-left", `${newPos.left}%`);
                star.style.setProperty("--star-top", `${newPos.top}%`);

                setTimeout(() => {
                    star.style.opacity = '1';
                }, 300);
            }, 800);
        };

        const initialDelay = (index + 1) * 1000;
        const cycleInterval = 4000 + (index * 500);

        setTimeout(() => {
            cycleStar();
            const interval = setInterval(cycleStar, cycleInterval);
            this.intervals.push(interval);
        }, initialDelay);
    }

    // Animate SVG Logo with pure CSS/JS (GSAP alternative)
    animateSVGLogo() {
        const svgElement = document.querySelector('.logo-svg');
        if (!svgElement) return;

        // Set initial state
        svgElement.style.transform = 'translateX(-200px) rotate(-180deg) scale(0.5)';
        svgElement.style.opacity = '0';
        svgElement.style.transition = 'none';

        // Entry animation
        setTimeout(() => {
            svgElement.style.transition = 'all 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            svgElement.style.transform = 'translateX(0) rotate(360deg) scale(1)';
            svgElement.style.opacity = '1';

            // Bounce effect
            setTimeout(() => {
                svgElement.style.transition = 'transform 0.3s ease-out';
                svgElement.style.transform = 'translateX(0) rotate(360deg) scale(1.1)';

                setTimeout(() => {
                    svgElement.style.transform = 'translateX(0) rotate(360deg) scale(1)';
                    
                    // Start continuous rotation
                    setTimeout(() => {
                        this.startContinuousRotation(svgElement);
                    }, 300);
                }, 300);
            }, 1500);
        }, 500);

        // Hover effects
        this.addHoverEffects(svgElement);
    }

    // Continuous rotation animation
    startContinuousRotation(element) {
        let rotation = 360;
        
        const rotate = () => {
            rotation += 360;
            element.style.transition = 'transform 4s linear';
            element.style.transform = `translateX(0) rotate(${rotation}deg) scale(1)`;
        };

        const interval = setInterval(rotate, 4000);
        this.intervals.push(interval);
        rotate(); // Start immediately
    }

    // Add hover effects to SVG
    addHoverEffects(svgElement) {
        let currentScale = 1;
        let currentRotation = 0;

        svgElement.addEventListener('mouseenter', () => {
            const computedStyle = window.getComputedStyle(svgElement);
            const matrix = computedStyle.transform;
            
            if (matrix !== 'none') {
                const values = matrix.split('(')[1].split(')')[0].split(',');
                const a = values[0];
                const b = values[1];
                currentRotation = Math.round(Math.atan2(b, a) * (180/Math.PI));
            }

            svgElement.style.transition = 'transform 0.3s ease-out';
            svgElement.style.transform = `translateX(0) rotate(${currentRotation + 180}deg) scale(1.15)`;
        });

        svgElement.addEventListener('mouseleave', () => {
            svgElement.style.transition = 'transform 0.3s ease-out';
            svgElement.style.transform = `translateX(0) rotate(${currentRotation}deg) scale(1)`;
        });
    }

    // Clean up intervals when needed
    destroy() {
        this.intervals.forEach(interval => clearInterval(interval));
        this.intervals = [];
        this.isInitialized = false;
    }

    // Restart animations (useful for page navigation)
    restart() {
        this.destroy();
        setTimeout(() => {
            this.init();
        }, 100);
    }
}

// Create global instance
const animationController = new AnimationController();

// Auto-initialize when script loads
animationController.init();

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationController;
}
