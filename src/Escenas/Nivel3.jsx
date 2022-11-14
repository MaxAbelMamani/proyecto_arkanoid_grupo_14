import React from 'react'
import Phaser from 'phaser'

//IMportando Imagenes
import background from '../assets/sprites/background.jpg'

//Importando Sonidos
import blockSound from '../assets/sounds/block.mp3'
import boingSound from '../assets/sounds/Boing.mp3'
import failSound from '../assets/sounds/fail.mp3'
import startSound from '../assets/sounds/start.wav'
import BackgroundSound from '../assets/sounds/backgroundsound.mp3'

//IMportando Funciones
import marcadorGame from '../Components/marcadorGame.jsx'
import vidasGame from '../Components/vidasGame.jsx'
import Bloques from '../Components/Bloques.jsx'
import Paleta from '../Components/Paleta.jsx'
import Bola from '../Components/Bola.jsx'
import BotonVolver from '../Components/BotonVolver.jsx';


class Nivel3 extends (React.Component, Phaser.Scene) {
    constructor(){
        super({ key: 'nivel3'});
        this.nivel = 3;
    }

    init(){
        this.marcador = new marcadorGame(this);
        this.vida = new vidasGame(this);
        this.bloques = new Bloques(this);
        this.paleta = new Paleta(this);
        this.bola = new Bola(this);
        this.botonVolver = new BotonVolver(this);
    }

    preload(){
        this.load.image('background',background);
        this.load.audio('block', blockSound);
        this.load.audio('boing', boingSound);
        this.load.audio('fail', failSound);
        this.load.audio('start', startSound);
        this.load.audio('bgSound', BackgroundSound);
        this.paleta.preload();
        this.bola.preload();
        this.bloques.preload();
        this.botonVolver.preload();
    }

    create(){
        //Gestiona las las coliciones de las paredes del mundo
        //El valor false representa a la pared inferior la cual esta no tendra colision con el onbjeto bola
        this.physics.world.setBoundsCollision(true, true, true, false);
        this.crearFondo();
        this.crearSonidos();
        this.marcador.create();
        this.vida.create();
        this.bloques.crearBloques(this.nivel);
        this.paleta.crearPaleta();
        this.bola.crearBola();
        this.botonVolver.create(750, 550);

        this.physics.add.collider(this.bola.pelotaGame, this.paleta.paletaPlayer, this.colisionBolaPaleta, null, this);
        this.physics.add.collider(this.bola.pelotaGame, this.bloques.conjuntoBloques, this.colisionBolaBloque, null, this);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.precionarTeclaEspacio = true; 
        this.startSound.play();
    }

    crearFondo(){
        this.add.image(400,300,'background');
    }

    crearSonidos(){
        this.blockSound = this.sound.add('block');
        this.boingSound = this.sound.add('boing');
        this.failSound = this.sound.add('fail');
        this.startSound = this.sound.add('start');
        this.backgroundSound = this.sound.add('bgSound');
        this.backgroundSound.loop  = true;
        this.backgroundSound.play();
    }

    colisionBolaBloque(bola, bloque){
        bloque.disableBody(true, true);
        this.marcador.incremenarPuntaje(10);
        this.blockSound.play();
        if (this.bloques.conjuntoBloques.countActive() == 0) {
            this.mostrarCongratulations();
        }
    }

    colisionBolaPaleta(bola, paleta){
        this.marcador.incremenarPuntaje(1);
        let impactoRelativo = bola.x - paleta.x;
        console.log(impactoRelativo);
        this.boingSound.play();
        if (impactoRelativo < 0.1 && impactoRelativo > -0.1) {
            bola.setVelocityX(Phaser.Math.Between(-10,10));
        }else{
            bola.setVelocityX(10 * impactoRelativo);
        }
    }

    update(){
        if (this.cursors.left.isDown) {
            this.paleta.paletaPlayer.setVelocityX(-500);
            if (this.bola.pelotaGame.getData('bolaPegada')) {
                this.bola.pelotaGame.setVelocityX(-500);
            }
        }else if (this.cursors.right.isDown) {
            this.paleta.paletaPlayer.setVelocityX(500);
            if (this.bola.pelotaGame.getData('bolaPegada')) {
                this.bola.pelotaGame.setVelocityX(500);
            }
        }else{
            this.paleta.paletaPlayer.setVelocity(0);
            if (this.bola.pelotaGame.getData('bolaPegada')) {
                this.bola.pelotaGame.setVelocityX(0);
            }
        }

        if (this.bola.pelotaGame.y > 600) {
            this.vida.decrementarVida(1);
            this.bola.pelotaGame.x = this.paleta.paletaPlayer.x;
            this.bola.pelotaGame.y = this.paleta.paletaPlayer.y - 40;
            this.bola.pelotaGame.setVelocity(0);
            this.bola.pelotaGame.setData('bolaPegada', true);
            this.failSound.play();
            this.precionarTeclaEspacio = true;
        }

        if (this.vida.vidas == 0) {
            this.mostrarGameOver();
        }

        if (this.cursors.space.isDown && this.precionarTeclaEspacio) {
            this.precionarTeclaEspacio = false;
            this.bola.pelotaGame.setVelocity(-75,-300);
            this.bola.pelotaGame.setData('bolaPegada', false);
            this.boingSound.play();
        }
    }

    mostrarGameOver(){
        this.scene.start('gameOver');
        this.backgroundSound.stop();
    }

    mostrarCongratulations(){
        this.scene.start('congratulations');
        this.backgroundSound.stop();
    }
}

export default Nivel3;