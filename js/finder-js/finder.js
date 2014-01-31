/*
 * The Finder can be customised by providing a javascript function 'customizeFinder()'
 * that returns an object with parameters. See example below.
 * The parameters that can be specifies are:
 *
 * externalSources: an Array. Default is ["eur","wp","scr","ss","gb"]
 *     	eur: Europeana
 * 		wp: Wikipedia
 * 		scr: Scribd
 * 		ss: Slideshare
 * 		gb: Google Books
 * 		They are rendered in the order given
 * facets: an Array. Default is ["provider","language","format","context","lrt"]
 * 		'lrt' means Learning resource type
 * 		They are rendered in the order given
 * facetIncludes: an Object with facets as possible members.
 * 		For example {"language":["en","fr","nl","de"],"provider":["ARIADNE","OERcommons"]}
 * limitFacetDisplay:an Object with facets as possible members.
 * 		For example {"language":["en","fr","nl","de"]},
 * maxLengthDescription:  Default is 650
 * pageContainers: an Array. Default is ["bottom"]. Available options are ["bottom","top"]
 * pageSize: Default is 10
 * repositoryName: Default is "ARIADNE"
 * serviceUrl: the URL of the repository services. Default is "http://ariadne.cs.kuleuven.be/GlobeFinderF1/servlet/search"
 *
 *
 function customizeFinder() {
 return {
 "repositoryName": "AgLR",
 "pageContainers":["top","bottom"],
 "facets":["provider","lrt","language","context"]
 }
 }
 * All global variables are now capitalised.
 * All local variables should be declared with a 'var' in the respective function, and should not be capitalised.
 */
var SERVICE_URL = 'http://ariadne.cs.kuleuven.be/GlobeFinderF1/servlet/search';
var EXT_SOURCE_URL = 'http://ariadne.cs.kuleuven.be/GlobeFinderF1/servlet/search';
//var SERVICE_URL = 'http://ariadne.cs.kuleuven.be/globe-ws/api/ariadne/restp';
var ROOT_URL = 'http://ariadne.cs.kuleuven.be/finder/';
var START_DESCRIPTION = 0;
var END_DESCRIPTION = 650;
var REPOSITORY_NAME = "ARIADNE";
var THOUSAND_SEP = ',';
var FACET_TOKENS = ['provider', 'language', 'format', 'context', 'lrt', 'tagr'];
var FACET_INCLUDES = [];
var FACET_LABELS = {};

var SELECTED_LANGUAGE = "en";

FACET_LABELS['language'] = 'Language';
FACET_LABELS['contentType'] = 'Media Type';
FACET_LABELS['date'] = 'Year';
FACET_LABELS['licenceUri'] = 'Copyright';
FACET_LABELS['provider'] = 'Collections';
FACET_LABELS['collectionId'] = 'Philosophers';


//FACET_LABELS['contribute'] = 'Contributor'; // added in order to check the field
var LIMIT_FACET_DISPLAY = {};
var PAGE_CONTAINERS = [];
var EXT_SOURCES = ['eur', 'wp', 'scr', 'ss', 'gb'];
var AVAILABLE_ES = {};
AVAILABLE_ES['eur'] = {
  "engine": "Europeana",
  "name": "Europeana"
};
AVAILABLE_ES['wp'] = {
  "engine": "Wikipedia",
  "name": "Wikipedia"
};
AVAILABLE_ES['scr'] = {
  "engine": "Scribd",
  "name": "Scribd"
};
AVAILABLE_ES['ss'] = {
  "engine": "SlideShare",
  "name": "Slide Share"
};
AVAILABLE_ES['gb'] = {
  "engine": "GoogleBooks",
  "name": "Google Books"
};
var PAGE;
var PAGE_SIZE = 10;
var NR_RESULTS = 0;
var FINDER_INITIALIZED = false;


var CHECK = 0;
var langName = {};
var iter = 0;

langName['n/a'] = 'Other';
langName['en'] = 'English';
langName['eng;'] = 'English';
langName['eng'] = 'English';
langName['eng; eng'] = 'English';
langName['fr'] = 'French';
langName['fre'] = 'French';
langName['el'] = 'Greek';
langName['hun'] = 'Hungarian';
langName['et'] = 'Estonian';
langName['est'] = 'Estonian';
langName['nl'] = 'Dutch';
langName['ro'] = 'Romanian';
langName['de'] = 'German';
langName['deu'] = 'German';
langName['tr'] = 'Turkish';
langName['pt'] = 'Portuguese';
langName['por'] = 'Portuguese';
langName['es'] = 'Spanish';
langName['sv'] = 'Swedish';
langName['ell'] = 'Greek';
langName['lat'] = 'Latin';
langName['rus'] = 'Russian';
langName['mul'] = 'Multiple languages';
langName['cs'] = 'Czech';
langName['pl'] = 'Polish';
langName['hu'] = 'Hungarian';
langName['CS'] = 'Czech';
langName['swe'] = 'Swedish';
langName['fi'] = 'Finish';
langName['sl'] = 'Slovenian';
langName['sr'] = 'Serbian';
langName['DE'] = 'German';
langName['IT'] = 'Italian';
langName['ET'] = 'Estonian';



google.load("language", "1");

Event.observe(window, 'load', function() {
  initialSearch();
});

function initialSearch() {
  initializeFinder();
  var qs = location.search.substring(1);
  var parms = qs.toQueryParams();
  if (parms.query != undefined && parms.query != '') {
    $('query').value = parms.query;
  }
  if ($F('query').blank()) {
    resetFacets();
    findMaterials(0, PAGE_SIZE, true, true);
  } else {
    doSearch();
  }
}

function initializeFinder() {
  if (!FINDER_INITIALIZED) {

    if (typeof customizeFinder == 'function') {
      var customParams = customizeFinder();
      var urlSelectedProviders = getUrlVars()["providers"];

      if (customParams) { /*limit collection|providers*/
        if (urlSelectedProviders) {
          SELECTED_PROVIDERS = urlSelectedProviders;
          //alert(urlSelectedProviders);
        }
        if (!urlSelectedProviders && customParams.selectedProviders) SELECTED_PROVIDERS = customParams.selectedProviders;

        /*---*/

        if (customParams.serviceUrl) SERVICE_URL = customParams.serviceUrl;
        if (customParams.repositoryName) REPOSITORY_NAME = customParams.repositoryName;
        if (customParams.facets) FACET_TOKENS = customParams.facets;
        if (customParams.facetIncludes) {
          var ff = [];
          for (key in customParams.facetIncludes) {
            ff.push(key + ":" + customParams.facetIncludes[key]);
          };
          FACET_INCLUDES = ff;
        }
        if (customParams.limitFacetDisplay) LIMIT_FACET_DISPLAY = customParams.limitFacetDisplay;
        if (customParams.maxLengthDescription) END_DESCRIPTION = customParams.maxLengthDescription;
        if (customParams.pageSize) PAGE_SIZE = customParams.pageSize;
        if (customParams.pageContainers) {
          PAGE_CONTAINERS = [];
          for (var i = 0; i < customParams.pageContainers.length; i++) {
            PAGE_CONTAINERS.push('pagination_' + customParams.pageContainers[i]);
          }
        }
        if (customParams.externalSources) EXT_SOURCES = customParams.externalSources;
      }
    }

    if (PAGE_CONTAINERS.indexOf('pagination_top') >= 0) {
      if (!$('insert_pagination_top')) {
        $('body').insert('<div id="insert_pagination_top" style="display:none"></div>');

      }
      $('insert_pagination_top').update('<DIV id="pagination_top"></DIV>');
    }

    if (PAGE_CONTAINERS.indexOf('pagination_bottom') >= 0) {
      if (!$('insert_pagination_bottom')) {
        $('body').insert('<div id="insert_pagination_bottom" style="display:none"></div>');
      }
      $('insert_pagination_bottom').update('<div id="pagination_bottom"></div>');
    }


    if (!$('insert_summary')) {
      $('body').insert('<div id="insert_summary" style="display:none"></div>');
    }
    $('insert_summary').update('<div id="summary"><div id="search_title" ><span id="search_terms"></span> <span id="search_results_index"></span></div></div>');

    if (!$('insert_facets')) {
      $('body').insert('<div id="insert_facets" style="display:none"></div>');
    }
    var div = [];

    for (var i = 0; i < FACET_TOKENS.length; i++) {
      var fn = FACET_TOKENS[i];
      div.push('<a href="#" id="' + fn + '" onclick="return false;" class="filter_parent"><span>' + FACET_LABELS[fn] + '</span></a><div id="' + fn + '_rbo" class="filter_child" style="display: none;height:auto;"></div>');

    }


    div.push('</DIV>');

    $('insert_facets').update(div.join(''));




    if (!$('insert_results')) {
      $('body').insert('<div id="insert_results" style="display:none"></div>');
    }
    var div = [];
    var msg = 'Search the #{repName} Repository'.interpolate({
      repName: REPOSITORY_NAME
    });

    div.push('<DIV id="results">');
    div.push('<div id="searchMessage"><h3 align="center">' + msg + '</h3></div>');
    div.push('<div id="noResults" style="display:none"><h3 align="center">No Results Found</h3></div>');
    div.push('<div id="search_results"></div>');
    div.push('</div>');
    $('insert_results').update(div.join(''));


    initializeJamlTemplates();
    PAGE = new YAHOO.widget.Paginator({
      rowsPerPage: PAGE_SIZE,
      totalRecords: NR_RESULTS,
      containers: PAGE_CONTAINERS,
      template: "{PreviousPageLink} {PageLinks} {NextPageLink}"
    });
    PAGE.render();
    PAGE.subscribe('changeRequest', handlePagination);
    pagination_hide();

    FINDER_INITIALIZED = true;
  }
}

function toggleFacet(el) {
  $(el).toggleClassName('rbOpen');
}

function pagination_hide() {
  if ($('pagination_top')) $('pagination_top').hide();
  if ($('pagination_bottom')) $('pagination_bottom').hide();
}

function pagination_show() {
  if ($('pagination_top')) $('pagination_top').show();
  if ($('pagination_bottom')) $('pagination_bottom').show();
}

function resetFacets() {
  if ($('facets')) {
    var facets = $('facets').select('ul.rbList');
    $$('.ws_label').each(function(el) {
      el.removeClassName('parent-selected');
    });
    facets.each(function(item, index) {
      $(item.id).update('');
    });
  }
}








function getExternalSourceResult(prefix, engine) {
  if ($(prefix + '_results').empty()) {
    if ($F('query').blank()) {
      alert('Please enter a search string');
    } else {
      searchExternalSource(prefix, engine);
    }
  } else {
    $(prefix + '_results').update();
  }
}

function searchExternalSource(prefix) {
  var es_query = prepareQueryString();
  var res = $(prefix + '_results');
  $(prefix + '_indicator').show();
  res.update('');
  var clauses = [{
    language: 'VSQL',
    expression: es_query
  }];
  var request = {
    clause: clauses,
    resultFormat: 'json'
  };

  new Ajax.JSONRequest(EXT_SOURCE_URL, {
    callbackParamName: "callback",
    method: 'get',
    parameters: {
      json: Object.toJSON(request),
      engine: AVAILABLE_ES[prefix]['engine']
    },
    onSuccess: function(transport) {
      var result = transport.responseText.evalJSON(true).result;

      result['title'] = 'Search ' + AVAILABLE_ES[prefix]['name'];
      res.insert(Jaml.render(prefix + '_field', result));
    },
    onComplete: function(transport) {
      $(prefix + '_indicator').hide();
    }
  });
}

function doSearch() {
  if ($F('query').blank()) {
    alert('Please enter a search string');
    return;
  }
  $('searchMessage').hide();

/*   console.log('activityPost_call'); */
  activityPost($F('query'));
  /* getRelativeGoogleBooks($F('query')); */

  //showFacets();
  resetFacets();
  findMaterials(0, PAGE_SIZE, true, false);
  //searchExternalSources();
}

function externalSourceSelected(prefix) {
  return !$(prefix + '_results').empty();
}

function searchExternalSources() {
  for (var i = 0; i < EXT_SOURCES.length; i++) {
    if (externalSourceSelected(EXT_SOURCES[i])) searchExternalSource(EXT_SOURCES[i]);
  }
}

function prepareQueryString() {
  var spq = $F('query').split('keyword:');
  var text = spq[0];
  if (text.blank()) {
    if (spq.length > 1) {
      text = spq[1];
    }
  }
  text = text.strip();
  return text;
}

function searchByKeyword(key) {
  $('query').value = "keyword:" + key;
  doSearch();
}

function parseQueryString(initUpdate) {
  var spq = $F('query').split('keyword:');
  var plainText = spq[0];
  var clauses = [];

  var selectedProviders;
  if (typeof customizeFinder == 'function') {

    var customParams = customizeFinder();
    if (customParams.selectedProviders) {
      selectedProviders = customParams.selectedProviders;
      clauses.push({
        language: 'anyOf',
        expression: 'provider:' + selectedProviders
      });
    }

  }



  if (!plainText.blank()) {
    clauses.push({
      language: 'VSQL',
      expression: plainText
    });
    var lrt = getUrlVars()["lrt"];
    var key = getUrlVars()["keyword"];
    var context = getUrlVars()["context"];
    var urlSelectedProviders = getUrlVars()["providers"];
    var urlSelectedCollections = getUrlVars()["collection"];

    if (lrt) {
      lrt = lrt.replace("#", "").replace("%20", " ");
      clauses.push({
        language: 'anyOf',
        expression: 'lrt:' + lrt
      });
    }
    if (key) {
      key = key.replace("#", "").replace("%20", " ");
      clauses.push({
        language: 'anyOf',
        expression: 'keyword:' + key
      });
    }
    if (context) {
      context = context.replace("#", "").replace("%20", " ");
      clauses.push({
        language: 'anyOf',
        expression: 'context:' + context
      });
    }
    if (urlSelectedProviders) {
      urlSelectedProviders = urlSelectedProviders.replace("#", "").replace("%20", " ");
      clauses.push({
        language: 'anyOf',
        expression: 'provider:' + urlSelectedProviders
      });
    }
    if (urlSelectedCollections) {
      urlSelectedCollections = urlSelectedCollections.replace("#", "").replace("%20", " ").replace("%20", " "); // NEED TO CREATE A FUNCTION  TO REPLACE ALL OCCURENCIES
      clauses.push({
        language: 'anyOf',
        expression: 'collection:' + urlSelectedCollections
      });
    }

    //clauses.push({language:'anyOf',expression:'keyword:' + key});
    //clauses.push({language:'anyOf',expression:'lrt:image'});
    // add the below to code @ github. It is to limit the results only for OE collection //
  }
  //previous one
  //    {
  //        clauses.push({language:'VSQL',expression:plainText});
  //    }



  if (spq.length > 1) {
    var keyword = spq[1];
    clauses.push({
      language: 'anyOf',
      expression: 'keyword:' + keyword
    });
  }
  if (plainText.blank()) {
    clauses.push({
      language: 'anyOf',
      expression: 'collection:*'
    });
  }
  return clauses;
}

// Get the parameters of the url


function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
    vars[key] = value;
  });
  return vars;
}

//Example use formatInteger(12345678,',')


function formatInteger(number, com) {
  var num = number.toString();
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(num)) {
    num = num.replace(rgx, '$1' + com + '$2');
  }
  return num;
}

function findMaterials(start, numberResults, needsUpdate, initUpdate) {
  var selectedFacets = $('insert_facets').select('a.facet-selected');

  var facetExpressions = $H();
  selectedFacets.each(function(item, index) {
    var pos = item.id.indexOf(':');
    var facet = item.id.substring(0, pos);
    var facetValue = item.id.substring(pos + 1);
    facetValue = facetValue.replace(/\"/g, "'");
    facetExpressions.set(facet, (facetExpressions.get(facet) == undefined) ? facetValue : facetExpressions.get(facet) + "," + facetValue);
  });

  var clauses = parseQueryString(initUpdate);

  facetExpressions.each(function(pair) {
    clauses.push({
      language: 'anyOfFacet',
      expression: pair.key + ":" + pair.value
    });

  });
  FACET_INCLUDES.each(function(exp) {
    clauses.push({
      language: 'anyOfFacet',
      expression: exp
    });

  });

  // alert(JSON.stringify(clauses));
  var request = {
    clause: clauses,
    resultInfo: 'display',
    resultListOffset: start,
    resultListSize: numberResults,
    idListOffset: start,
    uiLanguage: 'en',
    facets: FACET_TOKENS,
    idListSize: numberResults,
    resultFormat: 'json',
    resultSortkey: ''
  };

  //alert(JSON.stringify(request));

  if (!$F('query').blank()) $('search_terms').update($F('query'));

  $('search_status').update('Searching...');
  $('noResults').hide();

  new Ajax.JSONRequest(SERVICE_URL, {
    callbackParamName: "callback",
    method: 'get',
    parameters: {
      json: Object.toJSON(request),
      engine: 'InMemory'
    },
    onSuccess: function(transport) {
      var result = transport.responseText.evalJSON(true).result;

      // alert(JSON.stringify(result));
      $('search_results').update('');
      $('noResults').hide();

      $('search_status').update('Processing time: ' + (result.processingTime / 1000).toFixed(3) + ' seconds');

      if (initUpdate) {
        $('searchMessage').insert('<h3 align="center">Available: ' + formatInteger(result.nrOfResults, ',') + ' learning resources</h3>');
      } else {
        $('search_terms').update('Results: ');
        $('searchMessage').update('');
        if (result.metadata.size() == 0) {
          $('noResults').show();
        }

        /*--------------------CREATE EVERY ITEM BEFORE CALL RENDERING WITH JAML-------------------------*/
        var oddCtr = 0; /*counter to add the odd style in listing*/
        result.metadata.each(function(item, index) {

          oddCtr++;
          item.isOdd = oddCtr;

          console.log(item);

		   /* LISTING ICONS BY TYPE */
		  /*
          if (item.format != undefined && item.format[0] != undefined) {
            if (item.format.indexOf('pdf') != -1) item.format = 'images/icons/pdf.png';
            else if (item.format.indexOf('powerpoint') != -1) item.format = 'images/icons/ppt.png';
            else if (item.format.indexOf('video') != -1) item.format = 'images/icons/video.png';
            else if (item.format.indexOf('zip') != -1) item.format = 'images/icons/zip.png';
            else if (item.format.indexOf('audio') != -1) item.format = 'images/icons/audio.png';
            else if ((item.format.indexOf('text') != -1) || (item.format[0].indexOf('multipart') != -1)) item.format = 'images/icons/text.png';
            else if ((item.format.indexOf('xml') != -1)) item.format = 'images/icons/xml.png';
            else if (item.format.indexOf('image') != -1) item.format = 'images/icons/image.png';
            //item.format=item.thumbnailUri;
            //item.format=item.location;
            else if ((item.format.indexOf('word') != -1) || (item.format.indexOf('wordprocessingml') != -1)) item.format = 'images/icons/word.png';
            else if ((item.format.indexOf('application') != -1)) item.format = 'images/icons/application.png';
            else item.format = 'images/icons/application.png';
          } else {
            item.format = 'images/icons/application.png';
          }
*/

          /* LISTING ICON BY PROVIDER*/
          if (item.contextUri.indexOf('europeana') != -1) item.format = 'images/icons/europeana.png';
          else if (item.contextUri.indexOf('books.google') != -1) item.format = 'images/icons/googlebooks.png';




          /* Description */
          if (item.description instanceof Object == false) {
            if (item.description != undefined) {
              item.thisDescription = item.description;
            }
          } else {
            if (item.description != undefined && item.description[0] != undefined) {
              item.thisDescription = item.description[0].value;

            }
            if (item.description != undefined && item.description.description_0 != undefined) {
              item.thisDescription = item.description.description_0;
            }
          }
          if (item.thisDescription == undefined) {
            item.thisDescription = " There is no defined description";
          }

          /* Title */
          if (item.alternative instanceof Object == false) {
            if (item.alternative != undefined) {
              item.thisTitle = item.alternative;
            }
          } else {
            if (item.alternative != undefined && item.alternative[0] != undefined) {
              item.thisTitle = item.alternative[0].value;
            }
            if (item.alternative != undefined && item.alternative.alternative_0 != undefined) {
              item.thisTitle = item.alternative.alternative_0;
            }

          }
          if (item.thisTitle == undefined) {
            item.thisTitle = " There is no defined title";
          }




          if (item.keywords == undefined || item.keywords == '') {
            $('search_results').insert(Jaml.render('resultwithoutkeywords', item));
          } else {

            try {
              item.keywords = item.keywords.split("&#044; ");
            } catch (e) {}

            var spt = item.title.split(",", 1);
            item.title = spt[0];
            var length = spt[0].length;

            if (item.title[0] == '[') item.title = item.title.substring(1, length);
            else item.title = item.title.substring(0, length);

            spt = item.description.split(",", 1);
            item.description = spt[0];
            length = spt[0].length;

            if (item.description[0] == '[') item.description = item.description.substring(1, length);
            else item.description = item.description.substring(0, length);

            item.isOdd = oddCtr;

            $('search_results').insert(Jaml.render('result', item));
            // alert("metaid:" +item.metaMetadataId);
            iter++;
          }


        });

        $('search_results_index').show();

        var finalNumberResults = ((start + numberResults) < result.nrOfResults) ? (start + numberResults) : result.nrOfResults;
        if (result.nrOfResults > 0) {
          $('search_results_index').update(' (#{start} - #{end} of #{total})'.interpolate({
            start: formatInteger(start + 1, THOUSAND_SEP),
            end: formatInteger(finalNumberResults, THOUSAND_SEP),
            total: formatInteger(result.nrOfResults, THOUSAND_SEP)
          }));
          pagination_show();
        } else {
          $('search_results_index').update('(No Results Found)');
          pagination_hide();
        }

/* for facet presentation
result.facets.each(function(item,index){

//     item.title = item.title.substring(0,length);

$('search_results').insert(Jaml.render('result2',item));

});
*/

      }


/*if(!keyword.blank()){
$('keywords_filter').show();
$('kwv').update(keyword);
}
else{
$('keywords_filter').hide();
}*/

      if (needsUpdate) {
        updatePaginator(result.nrOfResults);
        result.facets.each(function(item, index) {
          var fld = item.field;
          //rbkey = facetKeys[fld];
          var facetHasNoLimit = true;
          var limitValues = [];
          if (LIMIT_FACET_DISPLAY[fld]) {
            limitValues = LIMIT_FACET_DISPLAY[fld];
            facetHasNoLimit = false;
          }
          var rbkey = fld;
          var element = $(rbkey + '_rbo');
          if (element && facetExpressions.get(fld) == undefined) {
            element.update('');
            if (item.numbers != undefined) {
              item.numbers.each(function(it2, idx2) {
                if (facetHasNoLimit || limitValues.indexOf(it2.val) >= 0) {

                  it2.field = fld;
                  it2.val = it2.val.replace(/\'/g, "&#34;");
                  it2.count = formatInteger(it2.count, THOUSAND_SEP);
                  //element.insert(Jaml.render('rbcriteria',it2));
                  if (fld != "language") element.insert(Jaml.render('rbcriteria', it2));

                  else
                  // check first if langName[it2.val] exists already in rbList
                  {
                    checkLang(it2.val, it2.count);

                    if (CHECK == 0) element.insert(Jaml.render('rbcriteria2', it2));

                  }
                }
              });
            }
          }
        });


        facetSlide();

        selectedFacets.each(function(item, index) {
          $(item.id).addClassName('facet-selected');

        });
      }
      //webSnapr.init();
      //$('header').scrollTo();
      //loadTranslator();

    },
    onComplete: function(transport) {
      // $('search_status').update('');
    },
    onLoading: function() {
      $('search_results').update('');
      $('search_terms').update('');
      $('search_results_index').update('');
    }
  });
}

function checkLang(name, counter) {

  CHECK = 0;
  $$('#language_rbo li').each(function(item) {

    //  alert(item.innerHTML);
    var pos = item.id.indexOf(':');

    var langValue = item.id.substring(pos + 1);

    if (langName[langValue] == langName[name]) {
      //   pos = item.name.indexOf('/a');
      var count = item.innerHTML;
      pos = count.indexOf('/a');
      var length = count.length;
      count = item.innerHTML.substring(pos + 5, length - 1);

      count = count.replace(",", "");
      var num = count * 1;

      num = Number(num) + Number(counter);
      num = formatInteger(num, THOUSAND_SEP);

      item.update(item.innerHTML.substring(0, pos + 4) + '(#{count})'.interpolate({
        count: num
      }));
      CHECK = 1;

      return;
    }

  });


}



function addEndingDescription(data) {
  if (data.length == 0) return "";
  return (data.length < END_DESCRIPTION) ? data : (data.substr(START_DESCRIPTION, END_DESCRIPTION)).concat("", " <span class='suspension-points'>...</span>");
}

function removeHtmlTags(data) {
  var strInputCode = data.replace(/&(lt|gt);/g, function(strMatch, p1) {
    return (p1 == "lt") ? "<" : ">";
  });
  var strTagStrippedText = strInputCode.replace(/<\/?[^>]+(>|$)/g, " ");
  return strTagStrippedText;
}

function stripUrl(data) {

  var strTagStrippedText = data.replace(/<\/?[^>]:+(>|$)/g, "_");
  return strTagStrippedText;


}




function initializeJamlTemplates() {

  Jaml.register('thumb_pres', function(data) {
    a({
      href: data.location,
      title: data.title,
      target: '_blank'
    }, img({
      src: data.format,
      height: "90",
      width: "80"
    }))
  });


  Jaml.register('keyword', function(data) {
    a({
      href: 'javascript:void(0);',
      onclick: "searchByKeyword('#{key}')".interpolate({
        key: data
      })
    }, data);
  });


  /*-----------------------------RENDER RESULT LISTING ITEMS--------------------------------*/


  Jaml.register('result', function(data) {

    var keywordsToEmbed = " ";


    var odd = "";
    if (data.isOdd % 2 === 1) {
      odd = "odd"
    }

    //keywords
    if (data.subject != undefined) {
      for (var i = 0, length = data.subject.length; i < length; i++) {
        if (data.subject[i].lang == 'en') {
          if (i !== length - 1) {
            keywordsToEmbed += "<a class=\"secondary\" href=\"listing.html?query=" + data.subject[i].value + "\">&nbsp" + data.subject[i].value + "</a>"
          } else {
            keywordsToEmbed += "<a class=\"secondary last\" href=\"listing.html?query=" + data.subject[i].value.split(" ")[0] + "\">&nbsp" + data.subject[i].value + "</a>"
          }
        } //end lang check
      } //end for
    } //end if



    var thisRights = data.licenseUri;
    if (data.licenseUri == undefined) {
      thisRights == "undefined";
    }

    var thisRights2 = data.rights;
    if (data.rights == undefined) {
      thisRights2 == "undefined";
    }

	var this_id = data.identifier.replace("http://", "");
	console.log(this_id);
	/*TO BE REPLACED BY A GENERAL SOLUTION : FIXES PROBLEM WITH 'id=' and '-' inside google books URIs*/
	if(this_id.indexOf('books.google') !== -1) {
		this_id = this_id.split('id=')[1];
		if(this_id[0]=='-') {
			this_id = this_id.replace('-','');
		}
	}
	/*-------*/


    article({
      class: 'item-intro ' + odd
    }, header(
    h2( //img({src:imgThumb}),
    a({
      href: "item.html?id=" + this_id,
      cls: 'listing-item-title',
      title: data.thisTitle,
      target: '_blank'
    }, data.thisTtitle)), section(p({
      cls: 'item-intro-desc'
    }, data.thisDescription), aside({
      cls: 'clearfix'
    }, div({
      cls: 'floatleft'
    }, div({
      cls: 'line keywords'
    }, span("Keywords:"), keywordsToEmbed)), div({
      cls: 'language'
    }, span("Creative commons licence:"), thisRights), div({
      cls: 'language'
    }, span("Rights:"), thisRights2), div({
      cls: 'floatright'
    }, div({
      cls: 'line alignright'
    }, a({
      href: data.contextUri,
      cls: 'item-intro-left-link'
    }, "View Resource in Provider"),
    	a({
      href: "item.html?id=" + this_id,
      cls: 'moreinfo'
    }, "More Info")))))))
  });




  Jaml.register('resultwithoutkeywords', function(data) {

    //               odd++;
    //               var backgroundClass = ""
    //               if(odd%2===0){backgroundClass = "odd";}
    var keywordsToEmbed = " ";

    var odd = "";
    if (data.isOdd % 2 === 1) {
      odd = "odd"
    }


    //keywords
    if (data.subject != undefined) {
      for (var i = 0, length = data.subject.length; i < length; i++) {
        if (data.subject[i].lang == 'en') {
          if (i !== length - 1) {
            keywordsToEmbed += "<a class=\"secondary\" href=\"listing.html?query=" + data.subject[i].value + "\">&nbsp" + data.subject[i].value + "</a>"
          } else {
            keywordsToEmbed += "<a class=\"secondary last\" href=\"listing.html?query=" + data.subject[i].value.split(" ")[0] + "\">&nbsp" + data.subject[i].value + "</a>"
          }
        } //end lang check
      } //end for
    } //end if

    var imgThumb = data.format;


	/*
	           if(data.contentType[0].toUpperCase() == 'IMAGE')
	           {
	           imgThumb = data.objectUri[0];
	           }
	*/

    var this_id = data.identifier.replace("http://", "");
	console.log(this_id);
    /*TO BE REPLACED BY A GENERAL SOLUTION : FIXES PROBLEM WITH id= inside google books URIs*/
	if(this_id.indexOf('books.google') !== -1) {
		this_id = this_id.split('id=')[1];
		if(this_id[0]=='-') {
			this_id = this_id.replace('-','');
		}
	}
	/*-------*/



    article({
      class: 'item-intro ' + odd
    }, header(
    h2(img({
      src: imgThumb
    }), a({
      href: "item.html?id=" + this_id,
      cls: 'listing-item-title',
      title: data.thisTitle,
      target: '_blank'
    }, data.thisTitle)), section(p({
      cls: 'item-intro-desc'
    }, data.thisDescription), aside({
      cls: 'clearfix'
    }, div({
      cls: 'floatright'
    }, div({
      cls: 'line alignright'
    }, a({
      href: data.contextUri,
      target: '_blank',
      cls: 'item-intro-left-link'
    }, "View Resource in Provider"),
    	 a({
      href: "item.html?id=" + this_id,
      cls: 'moreinfo'
    }, "More Info")))))))
  });




  /*-----------------------------RENDER FACETS--------------------------------*/



  Jaml.register('rbcriteria', function(data) //rest facets
  {

    var label = data.val;

    a({
      href: '#',
      id: data.field + ':' + data.val,
      title: data.val,
      onclick: "toggleFacetValue('#{id}','#{parent}')".interpolate({
        id: data.field + ':' + data.val,
        parent: data.field
      })
    }, span(label), span({
      cls: 'total'
    }, data.count));


  });


  Jaml.register('rbcriteria2', function(data) //language facet
  {

    a({
      href: '#',
      id: data.field + ':' + data.val,
      title: data.val,
      onclick: "toggleFacetValue('#{id}','#{parent}')".interpolate({
        id: data.field + ':' + data.val,
        parent: data.field
      })
    }, span(langName[data.val]), span({
      cls: 'total'
    }, data.count));

    //              li({id: data.field + ':' + data.val},
    //         a({href:'javascript:void(0);', title: data.val,onclick: "toggleFacetValue('#{id}','#{parent}')".interpolate({id: data.field + ':' + data.val,parent: data.field}),},
    //           span(langName[data.val]), span({cls:'total'}, data.count )));
  });


  /*------------------------------*/
}


/**
* facetSlide()
* open & close facets
*/

function facetSlide() {

  jQuery(document).ready(function() {

    jQuery('.filter_parent').each(function() {
      if (jQuery(this).hasClass("opened")) jQuery(this).next().css("display", "block");
    });
    jQuery('.filter_parent').click(function(event) {
      event.preventDefault();
      jQuery(this).toggleClass("opened");
      jQuery(this).next().slideToggle("slow");
    });
    exit();

  });
}

/**
* activityPost()
* creates the json for the request.
* @param searchedQuery : the query from search field
*
*/
function activityPost(searchedQuery) {
/*   console.log('activityPost'); */

  var country = "Unknown Country";
  var datetime = (new Date()).toISOString();
  var thisJson = {}; /* get country code */
  jQuery.get("http://ipinfo.io", function(response) {
    country = response.country;

	var thisJson = {"actor" : {"objectType": "person", "id": country+"_User", "image": { "url": "", "width": 72, "height": 72 }, "displayName": "User from " + country , "url": "" }, "verb": "searched", "object": { "objectType":"searchTerm", "url": "http://greenlearningnetwork.org/axiom/listing.html?query=" + searchedQuery, "displayName": searchedQuery}, "published": datetime }

    publishActivity(thisJson);

  }, "jsonp");


}


/**
* publishActivity()
* makes tha ajax call to publish a new activity.
* @param thisJson : the query from search field
*
*/
function publishActivity(thisJson) {
/*   console.log(thisJson); */
  jQuery.ajax({
    url: "http://as-ecloud.appspot.com/api/activities/add",
    type: "POST",
    data: JSON.stringify(thisJson),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function(msg) {
/*       console.log('Registerd successfully'); */
    },
    error: function(msg) {
/*       console.log('Failed: ' + msg.status); */
    }
  });
}



/**
* getRelativeGoogleBooks(search_query)
* creates the json for the request.
* @param search_query : the query from search field
*/
function getRelativeGoogleBooks(search_query)
{
  var gbooks_get = "https://www.googleapis.com/books/v1/volumes?q="+search_query+"+philosophy";

  jQuery.get(gbooks_get, function(response) {
/* 	  console.log(gbooks_get) */
/* 	  console.log(response.items[0]); */
	  var books = '';
	  for(i=0 ; i<5; i++) {
/* 	  	  console.log(response.items[i]); */
		  books += '<li><a href=\"'+response.items[i].volumeInfo.previewLink+'\" target=\"_blank\">'+(i+1)+'. '+response.items[i].volumeInfo.title+'</a></li>';
	  }

	  /* console.log(books); */
	  document.getElementById('related_google_books_items').innerHTML = '<ul>'+books+'</ul>';

  }, "jsonp");

}



function updatePaginator(NR_RESULTS) {
  PAGE.set('totalRecords', NR_RESULTS);
  PAGE.set('recordOffset', 0);
}


function handlePagination(newState) {
  // Collect page data using the requested page number
  //newState.
  findMaterials(newState.recordOffset, newState.rowsPerPage, false, false);
  // Update the Paginator's state
  PAGE.setState(newState);

}

function selectParent(parent) {
  var childSelected = false;

  $(parent + '_rbo').childElements().each(function(el) {
    if (el.hasClassName('facet-selected')) {
      $(parent).addClassName('parent-selected');
      childSelected = true;
    }
  });

  if (!childSelected) $(parent).removeClassName('parent-selected');
}

function toggleFacetValue(elem, parent) {
  $(elem).toggleClassName('facet-selected');
  selectParent(parent);
  findMaterials(0, PAGE_SIZE, true, false);
}

function html_entity_decode(str) {
  var ta = document.createElement("textarea");
  ta.innerHTML = str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  var val = ta.value;
  ta.parentNode.removeChild(ta);
  return val;
}

function fullLangName(iso) {

  var fullName = "";

  if (iso == "en") fullName = langName["en"];
  else if (iso == "fr") fullName = langName["fr"];


  return fullName;
}