//JSONP version
//we get a json array and manipulate it.


function getItemJSONP(itemID) {

  urlTemp = "http://83.212.96.169:8080/ecloud/api/ariadne/restp?json=%7B%22clause%22%3A%20%5B%7B%22language%22%3A%20%22VSQL%22%2C%20%22expression%22%3A%20%22" + itemID + "%22%7D%5D%2C%20%22resultInfo%22%3A%20%22display%22%2C%20%22resultListOffset%22%3A%200%2C%20%22resultListSize%22%3A%206%2C%20%22idListOffset%22%3A%200%2C%20%22uiLanguage%22%3A%20%22en%22%2C%20%22facets%22%3A%20%5B%22provider%22%2C%20%22language%22%2C%20%22format%22%2C%20%22classification%22%5D%2C%20%22idListSize%22%3A%206%2C%20%22resultFormat%22%3A%20%22json%22%2C%20%22resultSortkey%22%3A%20%22%22%7D&engine=InMemory";
  //alert(urlTemp);
  /*languages - to be replaced with flags*/
  var langName = {};
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
  langName['ET'] = 'Estonian'; /* /languages */


  jQuery.ajax({
    url: urlTemp,
    dataType: "jsonp",
    success: function(data) {



      //parse array and create an JS Object Array
      //every item is a JSON
      var thisJson = JSON.stringify(data);
      var tmp = JSON.parse(thisJson);

      var record = "";
      if (tmp.result.metadata[0] != undefined) {
        record = tmp.result.metadata[0];
      }

      console.log(tmp);

      //MORE INFO
      /* provider */
      if (record.provider != undefined) {
        document.getElementById('provider').innerHTML = record.provider;
      }

      /* data_provider */
      if (record.dataProvider != undefined) {
        document.getElementById('data_provider').innerHTML = record.dataProvider;
      }

      /* language */
      if (record.language != undefined) {
        document.getElementById('language').innerHTML = langName[record.language];
      }

      /* media type */
      if (record.contentType != undefined) {
        document.getElementById('media_type').innerHTML = record.contentType;
      }

      /* date */
      if (record.date != undefined) {
        document.getElementById('date').innerHTML = record.date;
      }

      //DESCRIPTION
      /* Description */
      if (record.description instanceof Object == false) {
        if (record.description != undefined) {
          record.thisDescription = record.description;
        }
      } else {
        if (record.description != undefined && record.description[0] != undefined) {
          record.thisDescription = record.description[0].value;

        }
        if (record.description != undefined && record.description.description_0 != undefined) {
          record.thisDescription = record.description.description_0;
        }
      }
      if (record.thisDescription == undefined) {
        record.thisDescription = " There is no defined description";
      }
      document.getElementById('description').innerHTML = record.thisDescription;

      /* Title */
      if (record.alternative instanceof Object == false) {
        if (record.alternative != undefined) {
          record.thisTitle = record.alternative;
        }
      } else {
        if (record.alternative != undefined && record.alternative[0] != undefined) {
          record.thisTitle = record.alternative[0].value;
        }
        if (record.alternative != undefined && record.alternative.alternative_0 != undefined) {
          record.thisTitle = record.alternative.alternative_0;
        }
      }
      if (record.thisTitle == undefined) {
        record.thisTitle = " There is no defined title";
      }

      /*title's link */
      if (record.contextUri != undefined) {
        document.getElementById('title').innerHTML = "<a href=\"" + record.contextUri + "\" target=\"_blank\">" + record.thisTitle + "</a>";
      } else {
        document.getElementById('title').innerHTML = record.thisTitle;
      }

      /* creator */
      var this_creator = "no creators are defined";
      if (record.creator instanceof Object == false) {
        if (record.creator != undefined) {
          this_creator = record.creator;
        }
      } else {
        if (record.creator != undefined && record.creator.length > 0) {
          this_creator = "";
          for (var i = 0, length = record.creator.length; i < length; i++) {
            if (i = 0) {
              this_creator = record.creator[i];
            } else {
              this_creator = this_creator + ", " + record.creator[i];
            }
          }
        }

        var temp_creator = Object.keys(record.creator)
        if (temp_creator.length > 0) {
          this_creator = "";
          for (var i = 0, length = temp_creator.length; i < length; i++) {
            this_creator = this_creator + ", " + record.creator[temp_creator[i]];
          }
        }
        console.log(Object.keys(record.creator));
      }

      document.getElementById('creator').innerHTML = this_creator;

      /* subject */
      var this_subject = "no subjects are defined";
      if (record.subject instanceof Object == false) {
        if (record.subject != undefined) {
          this_subject = record.subject;
        }
      } else {
        if (record.subject != undefined && record.subject.length > 0) {
          this_subject = "";
          for (var i = 0, length = record.subject.length; i < length; i++) {
            if (i = 0) {
              this_subject = record.subject[i];
            } else {
              this_subject = this_subject + ", " + record.subject[i];
            }
          }
        }

        var temp_subject = Object.keys(record.subject)
        if (temp_subject.length > 0) {
          this_subject = "";
          for (var i = 0, length = temp_subject.length; i < length; i++) {
            this_subject = this_subject + ", " + record.subject[temp_subject[i]];
          }
        }
        console.log(Object.keys(record.subject));
      }

      document.getElementById('subject').innerHTML = this_subject;

      /* period */
      if (record.temporal != undefined) {
        document.getElementById('period').innerHTML = record.temporal;
      } /* geograph coverage */
      if (record.spatial != undefined) {
        document.getElementById('spatial').innerHTML = record.spatial;
      } /* publisher */
      if (record.publisher != undefined) {
        document.getElementById('publisher').innerHTML = record.publisher;
      }





      /* rights */
      var this_rights = "no rights are defined";
      if (record.rights instanceof Object == false) {
        if (record.rights != undefined) {
          this_rights = record.rights;
        }
      } else {
        if (record.rights != undefined && record.rights.length > 0) {
          this_rights = "";
          for (var i = 0, length = record.rights.length; i < length; i++) {
            if (i = 0) {
              this_rights = record.rights[i];
            } else {
              this_rights = this_rights + ", " + record.rights[i];
            }
          }
        }

        var temp_rights = Object.keys(record.rights)
        if (temp_rights.length > 0) {
          this_rights = "";
          for (var i = 0, length = temp_rights.length; i < length; i++) {
            this_rights = this_rights + ", " + record.rights[temp_rights[i]];
          }
        }
        console.log(Object.keys(record.rights));
      }

      document.getElementById('rights').innerHTML = this_rights;

      /*common rights */
      if (record.licenseUri != undefined) {
        var common_rights = record.licenseUri;
        if (record.licenseUri.search("licenses/by-nc-sa") >= 0) {
          common_rights = '<nav  class="itemRights"><a href="' + record.licenseUri + '" class="secondary" target="_blank"><img style="display:inline;" src="images/cc/cc-by-nc-sa.png"></a></nav>';
        } else if (record.licenseUri.search("licenses/by-nc-nd") >= 0) {
          common_rights = '<nav  class="itemRights"><a href="' + record.licenseUri + '" class="secondary" target="_blank"><img style="display:inline;" src="images/cc/cc-by-nc-nd.png"></a></nav>';
        } else if (record.licenseUri.search("licenses/by-nd") >= 0) {
          common_rights = '<nav  class="itemRights"><a href="' + record.licenseUri + '" class="secondary" target="_blank"><img style="display:inline;" src="images/cc/cc-by-nd.png"></a></nav>';
        } else if (record.licenseUri.search("licenses/by-sa") >= 0) {
          common_rights = '<nav  class="itemRights"><a href="' + record.licenseUri + '" class="secondary" target="_blank"><img style="display:inline;" src="images/cc/cc-by-sa.png"></a></nav>';
        } else if (record.licenseUri.search("licenses/by-nc") >= 0) {
          common_rights = '<nav  class="itemRights"><a href="' + record.licenseUri + '" class="secondary" target="_blank"><img style="display:inline;" src="images/cc/cc-by-nc.png"></a></nav>';
        } else if (record.licenseUri.search("licenses/by") >= 0) {
          common_rights = '<nav  class="itemRights"><a href="' + record.licenseUri + '" class="secondary" target="_blank"><img style="display:inline;" src="images/cc/cc-by.png"></a></nav>';

        } else {
          common_rights = '<span>Rights: </span><nav  class="itemRights"><a href="' + record.licenseUri + '" class="secondary" target="_blank">' + record.licenseUri + '</a></nav>';
        }


        document.getElementById('creative_commons').innerHTML = common_rights;
      }

      /* bottom menu */
      if (record.contextUri != undefined) {
        document.getElementById('resource_actions').innerHTML = "<a href=\"" + record.contextUri + "\" target=\"_blank\"> View Resource</a><a href=\"#\">Add for Annotation</a><a href=\"#\"> Download XML file</a>";
      } else {
        document.getElementById('resource_actions').innerHTML = "<a href=\"#\"> View Resource</a><a href=\"#\">Add for Annotation</a><a href=\"#\"> Download XML file</a>";
      }

      //end of -success- of getItemJSONP
    }
  })
}


// ADD THE LINK TO THE BANNER IMAGES


function imageClick(url) {
  window.location = url;
}