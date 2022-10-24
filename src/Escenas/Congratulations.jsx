import React from 'react';
import { BotonReiniciar } from '../Funciones/BotonReiniciar';
import victory from '../assets/sprites/victory.png'

class Congratulations extends (React.Component, Phaser.Scene) {
    constructor(){
        super({ key: 'congratulations'});
        this.botonReiniciar = new BotonReiniciar(this);
    }

    preload(){
        this.load.image('victory',victory);
        this.botonReiniciar.preload();
    }

    create(){
        this.add.image(400,240,'background');
        this.botonReiniciar.create();
        this.victoryImage = this.add.image(400,90, 'victory');
    }
}

export default Congratulations;