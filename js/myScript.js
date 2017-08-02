// JavaScript File
/* global$*/   
/*function changeImage() {
var image = document.getElementById('myImage');
  if (image.src.match("tuna")) {
    image.src="img/tunas.png";
  }else {
    image.src="img/tuna.png";
 }
}*/


/*global google map js*/
function initMap() {
        // Create a map object and specify the DOM element for display.
        var map = new google.maps.Map(document.getElementById('map'), {
          center: { lat: 40.781523, lng: -73.966675 },
          scrollwheel: false,
          zoom: 14
        });
      }
 
      
/*animation page example*/
/* global$*/

/* Target the item using the class as the selector.*/
/* Single animation*/
$('.box1').animate({left: 200}, 500);
$('.box4').animate({left: 100}, 300);
/* Chained animation*/
$('.box2').animate({ 
    top: 100,
    left: 100,
    width: 100,
    height: 100,
}).animate({
    top: 50,
    left: 150,
    width: 50,
    height: 50,
}).animate({
    top: 150,
    left: 300,
    width: 300,
    height: 120,
}).animate({
    top: 70,
    left: 10,
    width: 50,
    height: 50,
}).animate({
    top: 350,
    left: 10,
    width: 50,
    height: 50,
});

$('.box3').animate({ 
    top: 200,
    left: 30,
    width: 80,
    height: 100,
}).animate({
    top: 200,
    left: 50,
    width: 50,
    height: 50,
}).animate({
    top: 150,
    left: 300,
    width: 200,
    height: 120,
}).animate({
    top: 170,
    left: 170,
    width: 50,
    height: 50,
}).animate({
    top: 370,
    left: 150,
    width: 50,
    height: 50,
});





/*global$*/
/*///////////////////////////////////////////explode code////////////////////////////*/
 $(function() {
  // Bind events and initialize plugin
  $('.explode')
    .on('pixellate-exploded', function() {
      var self = this;
      setTimeout(function() {
        $(self).pixellate('in');
      }, 1500);
    })
    .on('pixellate-imploded', function() {
      var self = this;
      setTimeout(function() {
       $(self).pixellate('out');
      }, 1500);
    })
    .pixellate()
});


var pluginName = 'pixellate',
    defaults = {
      // Grid divisions
      columns: 20,
      rows: 20,
      
      // Duration of explosion animation
      duration: 1500,
      
      // Direction of explosion animation ('out', 'in', or 'none')
      direction: 'out',
      
      // Resize pixels during animation
      scale: true,
      
      // Coordinates representing the source of the explosion force
      //(e.g. [-1, 1] makes the explodey bits go up and to the right)
      explosionOrigin: [0,0]
    };

function Plugin(el, options) {
  this.$el = $(el);
  this.options = $.extend({}, defaults, options);
  this._defaults = defaults;
  this._name = pluginName;

  this.init();
};

Plugin.prototype = {
  init: function() {
    if(!this.$el.find('.pixellate-pixel').length) {
      var $img = this.$el.find('img:first-child'),
          img = new Image();
      
      this.$el
        .data('pixellate-image', $img.attr('src'))
        .addClass('pixellate-lock');
      $img.css('visibility', 'hidden');
    
      $(img).one('load', $.proxy(this.createPixels, this));
      
      img.src = this.$el.data('pixellate-image');
      if(img.complete) $(img).trigger('load');
    } else {
      this.stylePixels();
    }
  },
  
  createPixels: function() {
    this.$el.append(new Array((this.options.rows * this.options.columns) + 1).join('<span class="pixellate-pixel"></span>'));
    
    this.stylePixels(true);
  },
  
  stylePixels: function(initializeStyles) {
    var self = this,
        w = this.$el.width(),
        h = this.$el.height(),
        columns = this.options.columns,
        rows = this.options.rows,
        $pixels = this.$el.find('.pixellate-pixel');
    
    var styles = initializeStyles ? {
      'position': 'absolute',
      'width': (w / columns),
      'height': (h / rows),
      'background-image': 'url('+this.$el.data('pixellate-image')+')',
      'background-size': w,
      'backface-visibility': 'hidden'
    } : {};
    
    for(var idx = 0; idx < $pixels.length; idx++) {
      var pixelStyles = {};
      
      if(initializeStyles) {
        var x = (idx % columns) * styles.width,
            y = (Math.floor(idx / rows)) * styles.height;
        
        $.extend(pixelStyles, styles, {
          'left': x,
          'top': y,
          'background-position': (-x)+'px '+(-y)+'px'
        });
      }
        
      if(self.options.direction == 'out') {
        var randX = (Math.random() * 300) - 150 - (self.options.explosionOrigin[0] * 150),
            randY = (Math.random() * 300) - 150 - (self.options.explosionOrigin[1] * 150);
        
        var transformString = 'translate('+randX+'px, '+randY+'px)';
        if(self.options.scale) {
          transformString += ' scale('+(Math.random() * 1.5 + 0.5)+')';
        }
        
        $.extend(pixelStyles, {
          'transform': transformString,
          'opacity': 0,
          'transition': self.options.duration+'ms ease-out'
        });
      } else if(self.options.direction == 'in') {
        $.extend(pixelStyles, {
          'transform': 'none',
          'opacity': 1,
          'transition': self.options.duration+'ms ease-in-out'
        });
      }

      $pixels.eq(idx).css(pixelStyles);
    }

    // Use rAF to ensure styles are set before class is modified
    requestAnimationFrame(function() {
      if(self.options.direction == 'out') {
        self.$el.removeClass('pixellate-lock');
      } else if(self.options.direction == 'in') {
        self.$el.one('pixellate-imploded', function() {
          self.$el.addClass('pixellate-lock');
        });
      }
    });
    
    // Fire plugin events after animation completes
    // TODO: Use transition events when supported
    setTimeout(function() {
      if(self.options.direction == 'out')
        self.$el.trigger('pixellate-exploded');
      else if(self.options.direction == 'in')
        self.$el.trigger('pixellate-imploded');
    }, this.options.duration);
  }
};

$.fn[ pluginName ] = function ( options ) {
  return this.each(function() {
    if ( !$.data( this, "plugin_" + pluginName ) ) {
      $.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
    } else if(typeof options === 'string') {
      $.data( this, "plugin_" + pluginName ).options.direction = options;
      $.data( this, "plugin_" + pluginName ).init();
    }
  });
};


// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
// MIT license
var lastTime = 0;
var vendors = ['ms', 'moz', 'webkit', 'o'];
for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
  window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
  window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
}

if (!window.requestAnimationFrame)
  window.requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
        timeToCall);
      lastTime = currTime + timeToCall;
      return id;
  };

if (!window.cancelAnimationFrame)
  window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
  };






/*///////////////////////////////////////////////////game shooting////////////////////////////*/
/*var LEFT_KEY = 37;
var UP_KEY = 38;
var RIGHT_KEY = 39;
var DOWN_KEY = 40;
var SAPCE_KEY = 32;
var HERO_MOVEMENT = 3;

var lastLoopRun = 0;


var controller = new Object();

function createSprite(element, x, y, w, h){
    var result = new Object();
    result.element = element;
    result.x = x;
    result.y = y;
    result.w = w;
    result.h = h;
    return result;
}

function toggleKey (keyCode, isPressed){
 if (keyCode == LEFT_KEY){
 controller.left = isPressed;
}
 if (keyCode == RIGHT_KEY){
    controller.right = isPressed;
}
 if (keyCode == TOP_KEY){
    controller.top = isPressed;
 }
 if (keyCode == DOWN_KEY){
    controller.down = isPressed;
 }
 if (keyCode == SPACE_KEY) {
     controller.space = isPressed;
 }
}

function ensureBounds(sprite) {
    if (sprite.x < 20) {
        sprite.x = 20;
    }
    if (sprite.y < 20) {
        sprite.y = 20;
    }
    if (spirte.x += sprite.w > 480) {
        sprite.x = 480 - sprite.w;
    }
    if (sprite.x + sprite.h > 480) {
        sprite.y = 480 - sprite.h;
    }
}

function setPosition(sprite) {
var e = document.getElementById(sprite, element);
e.style.left = sprite.x + ‘px’;
e.style.top = sprite.y + ‘px’;
}

function handleControls() {
	if (controller.up) {
	hero.y -=  HERO_MOVEMENT;
 }
	if (controller.down) {
	hero.y += HERO_MOVEMENT;
 }
	if (controller.left) {
	hero.x -= HERO_MOVEMENT;
 }
	if (controller.right) {
	hero.x += HERO_MOVEMENT;
 }
    if (controller.sapce && laser.y <= 120){
        laser.x = hero.x + 9;
        laser.y = hero.y - laser.h;
    }
    
    ensureBounds(hero);
}

function showSprites() {
	setPosition(hero);
    setPosition(laser);
}

function updatePositions(){
    laser.y -= 12;
}

function loop() {
	if (new Date().getTime() - lastLoopRun > 40) {
        updatePositions();
	    handleControls();
        showSprites();

	lastLoopRun = new Date().getTime();
 }
 //   setTimeOut(‘loop();’, 2);

}


document.onkeydown = function(evt) {
    toggleKey(evt.keyCode, true);
};

document.onkeyup = function(evt) {
toggleKey(evt.keyCode, false);
};

//setPosition(hero);
var hero = createSprite('hero', 250, 460, 20, 20);
var laser = createSprite('laser', 0, -120, 2, 50);
loop();*/