import _ from 'underscore';
import Product from 'game/Product';

class Piece {
  constructor(player) {
    this.owner = player;
    player.pieces.push(this);
  }

  attack(other) {
    // sometimes there is random bonus damage
    var bonus = Math.random() <= 0.1 ? 1 : 0;

    // attacker has the initiative
    other.health -= Math.round(this.health/2);
    if (Math.random() <= 0.5) {
      other.health -= bonus;
    }

    // defender must still be alive to fight back
    if (other.health > 0) {
      this.health -= Math.round(other.health/2);
      if (Math.random() <= 0.5) {
        this.health -= bonus;
      }
    }
    this.exhaust();
  }

  destroy() {
    this.tile.piece = null;
    this.owner.pieces = _.without(this.owner.pieces, this);
    this.sprite.destroy();
  }

  exhaust() {
    this.moves = 0;
    this.sprite.tint = this.owner.color * 0.25;
  }
}

class ProductPiece extends Piece {
  constructor(player, product, strength, health, movement) {
    super(player);
    this.product = product;
    this.name = this.product.name;
    this.spriteName = 'productPiece';
    this._strength = strength;
    this.health = health;
    this.moves = movement;
    this.movement = movement;
    this.maxHealth = health;
  }

  get strength() {
    return this._strength + this.hypeBonus;
  }

  get hypeBonus() {
    return Math.round(Math.sqrt(Math.abs(this.owner.hype)) * (this.owner.hype < 0 ? -1 : 1));
  }
}

export default {
  Product: ProductPiece
};