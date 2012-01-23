
var toggleNavSummary = function(hide) {
    if(hide) {
        $("#nav-summary-childs").hide();
    }
    else {
        $("#nav-summary-childs").show();
    }
}

var drop = {

   init: function(){
     $$('#nav-summary').each(function(el){
        el.addEvent('mouseover', function(){

            var ul = el.getElement('ul');
            if( $chk(ul) ){
                ul.set('tween', {duration:250});
                ul.tween('opacity', 1);
            }
        });
        el.addEvent('mouseout', function(){
										 
              var ul = el.getElement('ul');
            if( $chk(ul) ){
                ul.set('tween', {duration:500});
                ul.tween('opacity', 0);
            }
        });
    });
  }
}