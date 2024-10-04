import './Splash.css'

export default function Splash() {
  
    const splashImage = new Image();

    splashImage.src = "/images/pexels-martin-lopez-2240771.jpg"
    
    splashImage.onload = (e) => {
        e.preventDefault();
        const canvas = document.getElementById("splash-canvas");
        if(canvas) {
            const ctx = canvas.getContext('2d'); 
            ctx.drawImage(splashImage, 
            20, 20,
            splashImage.width - 20, splashImage.height - 20,
            0, -250,
            canvas.width, splashImage.height * (canvas.width / splashImage.width));
            
            ctx.fillStyle = "#f50"
            ctx.fillRect(0, 0, canvas.width, 4);
            
            ctx.font = "48px Montserrat";
            ctx.textAlign = "center"
            ctx.fillStyle = "white"
            ctx.fillText("Make the next big wave.", canvas.width / 2, canvas.height * 2/3);
        }
    }


    return (
        <div className="splash wrapper">
            <a title="Image courtesy of Martin Lopez - https://pexels.com/@mediocrememories">
            <canvas
            id="splash-canvas"
            className="splash-image display"
            width={1200}
            height={500}
            alt={"Smiling Man Standing and Dancing Near Smiling Woman Surrounded With People"}>
                
            </canvas>
            </a>
        </div>
    )
}