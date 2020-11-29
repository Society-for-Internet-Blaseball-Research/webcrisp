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
  "catch": "Total catches for fishery",
  "esc": "Spawning escapement for stock",
  "sim": "Incidental mortality for sub-legal sized chinook for fishery",
  "tim": "Total incidental mortality for fishery",
  "lim": "Incidental mmortality for legal sized chinook for fishery",
  "trm": "Terminal run for stock",
  "thr": "Total Exploitation Rate Statistics for stock",
  "ohr": "Ocean Exploitation Rate Statistics for stock",
  "stocks": "Total mortalities for stock & fishery"
}

var fishery_stats = ['abd','catch','lim','sim','tim'];
var stlat = "";

$(".graph-toggle").on('click',function(ev){
  stlat = $(ev.target).data('graph');

  // populate select
  $("#graphselect").empty();
  //console.log(Object.keys(sim_payload));
  if (fishery_stats.indexOf(stlat) >= 0) {
    sim_payload["fisheries"].forEach(function (f) {
      $("#graphselect").append("<option data-id=\"" + f["name"] + "\">"+f["name"]+"</option>");
    });
  } else {
    sim_payload["stocks"].forEach(function(f) {
      $("#graphselect").append("<option data-id=\"" + f["abbreviation"] + "\">"+f["name"]+"</option>");
    });
  }

  $("#graphmlabel").text(long_stlats[stlat]);
  //console.log($("#graphselect:first-child")[0][0].attributes["data-id"].nodeValue);
  render_stlat(stlat,$("#graphselect:first-child")[0][0].attributes["data-id"].nodeValue);

  // show modal
  $("#graphmodal").modal({backdrop:false,focus:false});
 // console.log($(ev.target).text());
  console.log("h-hewwo?");
  ev.stopPropagation();
  ev.stopImmediatePropagation();
});

$("#graphselect").change(function() {
  //console.log($("#graphselect option:selected")[0].attributes["data-id"].nodeValue);
  render_stlat(stlat,$("#graphselect option:selected")[0].attributes["data-id"].nodeValue);
});

function key_stats(s,key,chart) {
  chart.x = [];
  chart.y = [];
  //console.log(key);
  Object.keys(res[s][key]).forEach(function (k) {
    chart.x.push(k);
    chart.y.push(res[s][key][k]);
  });
}

function render_stlat(stlat,key) {
  var chart = {
    x: [],
    y: []
  };
  var chart_opts;

  console.log(stlat);
  switch (stlat) {
    case "abd":
      //console.log(key)
      axis = zip(res["abundances"][key]);
      chart.x = axis[0];
      chart.y = axis[1];
      break;
    case "stocks":
      data = {
        labels: [],
        datasets: []
      }

      Object.keys(res["stocks"][key]).forEach(function(k) {
        //console.log(res["stocks"][key]);
        axis = zip(res["stocks"][key][k]);
        data.labels = axis[0];
        data.datasets.push({
          backgroundColor: fishery_colors[k],
          borderColor: fishery_colors[k],
          data: axis[1],
          fill: false,
          label: k
        });
      });

      chart_opts = {
        type: 'line',
        data: data,
        options: {
          legend: {
            display: true
          }
        }
      };

      break;
    default:
      //console.log("hii");
      key_stats(stlat,key,chart)
  }

  if (stlat != "stocks") {
    chart_opts = {
      type: 'line',
      data: {
          labels: chart.x,
          datasets: [{
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: chart.y,
            fill: false,
            label: 'fish'
          }]
      },
      options: {
        legend: {
          display: false
        }
      }
    };
  }

  var canvas = document.getElementById('salmon_graph');
  var ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  var chart = new Chart(ctx, chart_opts);
}


var element = document.querySelector('#map')
panzoom(element, {
  bounds: true,
  boundsPadding: 0.6
});