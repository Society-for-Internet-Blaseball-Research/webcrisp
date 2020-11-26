function zip(arrays) {
  return arrays[0].map(function(_,i){
      return arrays.map(function(array){return array[i]})
  });
}

$('.dropdown-menu a.dropdown-toggle').on('click', function(e) {
    if (!$(this).next().hasClass('show')) {
      $(this).parents('.dropdown-menu').first().find('.show').removeClass("show");
    }
    var $subMenu = $(this).next(".dropdown-menu");
    $subMenu.toggleClass('show');
  
  
    $(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function(e) {
      $('.dropdown-submenu .show').removeClass("show");
    });
  
  
    return false;
});

$('.modal-content').resizable({
  //alsoResize: ".modal-dialog",
  minHeight: 300,
  minWidth: 300
});
$('.modal-dialog').draggable();

$('#graphmodal').on('show.bs.modal', function () {
  $(this).find('.modal-body').css({
      'max-height':'100%'
  });
});


var long_stlats = { // l o n g boys
  "abd": "Abundance indices for fishery",
  "cat": "Total catches for fishery",
  "esc": "Spawning escapement for stock",
  "sim": "Incidental mortality for sub-legal sized chinook for fishery",
  "tim": "Total incidental mortality for fishery",
  "lim": "Incidental mmortality for legal sized chinook for fishery",
  "trm": "Terminal run for stock"
}
var fishery_stats = ['abd','cat','lim','sim','tim'];
var stlat = "";

$(".graph-toggle").on('click',function(ev){
  stlat = $(ev.target).data('graph');

  // populate select
  $("#graphselect").empty();
  console.log(Object.keys(sim_payload));
  if (fishery_stats.indexOf(stlat) >= 0) {
    sim_payload["fisheries"].forEach(function (f) {
      $("#graphselect").append("<option>"+f["name"]+"</option>");
    });
  } else {
    sim_payload["stocks"].forEach(function(f) {
      $("#graphselect").append("<option>" + f["name"] + "</option>");
    });
  }

  $("#graphmlabel").text(long_stlats[stlat]);
  render_stlat(stlat,$("#graphselect:first-child")[0][0].label);

  // show modal
  $("#graphmodal").modal({backdrop:false,focus:false});
  console.log($(ev.target).text());
  console.log("h-hewwo?");
  ev.stopPropagation();
  ev.stopImmediatePropagation();
});

$("#graphselect").change(function() {
  render_stlat(stlat,$("#graphselect option:selected")[0].label);
});

function render_stlat(stlat,key) {
  var x;
  var y;
  console.log(stlat);
  if (stlat == "abd") {
    console.log(key)
    axis = zip(res["abundances"][key]);
    x = axis[0];
    y = axis[1];
  } else if (stlat == "cat") { // thank you
    x = [];
    y = [];
    Object.keys(res["catch"][key]).forEach(function (k) {
      x.push(k);
      y.push(res["catch"][key][k]);
    });
  } else {
    axis = zip(res[stlat][key]);
    x = axis[0];
    y = axis[1];
  }
  var canvas = document.getElementById('salmon_graph');
  var ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  var chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: x,
        datasets: [{
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: y,
            fill: false,
            label: 'fish'
        }]
    },
    options: {
      legend: {
        display: false
      }
    }
  });
}


var element = document.querySelector('#map')
panzoom(element, {
  bounds: true,
  boundsPadding: 0.6
});