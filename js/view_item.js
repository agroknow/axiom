//JSONP version
//we get a json array and manipulate it.
function getItemJSONP(itemID)
{
    
    urlTemp = "http://83.212.96.169:8080/ecloud/api/ariadne/restp?json=%7B%22clause%22%3A%20%5B%7B%22language%22%3A%20%22VSQL%22%2C%20%22expression%22%3A%20%22"+itemID+"%22%7D%5D%2C%20%22resultInfo%22%3A%20%22display%22%2C%20%22resultListOffset%22%3A%200%2C%20%22resultListSize%22%3A%206%2C%20%22idListOffset%22%3A%200%2C%20%22uiLanguage%22%3A%20%22en%22%2C%20%22facets%22%3A%20%5B%22provider%22%2C%20%22language%22%2C%20%22format%22%2C%20%22classification%22%5D%2C%20%22idListSize%22%3A%206%2C%20%22resultFormat%22%3A%20%22json%22%2C%20%22resultSortkey%22%3A%20%22%22%7D&engine=InMemory";
    //alert(urlTemp);
    
    /*languages - to be replaced with flags*/
    var langName = {};
    langName['n/a']='Other';
	langName['en']='English';
	langName['eng;']='English';
	langName['eng']='English';
	langName['eng; eng']='English';
	langName['fr']= 'French';
	langName['fre']= 'French';
	langName['el']= 'Greek';
	langName['hun']= 'Hungarian';
	langName['et']= 'Estonian';
	langName['est']= 'Estonian';
	langName['nl']= 'Dutch';
	langName['ro']= 'Romanian';
	langName['de']= 'German';
	langName['deu']= 'German';
	langName['tr']= 'Turkish';
	langName['pt']= 'Portuguese';
	langName['por']= 'Portuguese';
	langName['es']= 'Spanish';
	langName['sv']= 'Swedish';
	langName['ell']= 'Greek';
	langName ['lat'] = 'Latin';
	langName['rus'] = 'Russian';
	langName['mul'] = 'Multiple languages';
	langName['cs']= 'Czech';
	langName['pl']= 'Polish';
	langName['hu'] = 'Hungarian';
	langName['CS'] = 'Czech';
	langName['swe'] = 'Swedish';
	langName['fi'] = 'Finish';
	langName['sl'] = 'Slovenian';
	langName['sr'] = 'Serbian';
	langName['DE'] = 'German';
	/* /languages */
	
	
    jQuery.ajax({
        url: urlTemp,
        dataType: "jsonp",
        success: function(data)
        {
        
        
        
        //parse array and create an JS Object Array
        //every item is a JSON
        var thisJson = JSON.stringify(data);
        var tmp = JSON.parse(thisJson);
    
        var record = "";
        if(tmp.result.metadata[0]!=undefined){
        record = tmp.result.metadata[0];
        }
        
        console.log(tmp);
                        
        //MORE INFO
        
        /* provider */
        if(record.provider!=undefined)
        {
        	document.getElementById('provider').innerHTML = record.provider;
        }
        
        /* data_provider */
        if(record.dataProvider!=undefined)
        {
        	document.getElementById('data_provider').innerHTML = record.dataProvider;
        }
        
        /* language */
        if(record.language!=undefined)
        {
        	document.getElementById('language').innerHTML = langName[record.language];
        }
        
        /* media type */
        if(record.contentType!=undefined)
        {
        	document.getElementById('media_type').innerHTML = record.contentType;
        }
        
        /* date */
        if(record.date!=undefined)
        {
        	document.getElementById('date').innerHTML = record.date;
        }
                        
        //DESCRIPTION
		/* Description */
          if (record.description instanceof Object == false) 
          {
              if(record.description!=undefined)
              {
                  record.thisDescription=record.description;
              }
          }
          else
          {
              if(record.description!=undefined && record.description[0]!=undefined)
              {
                  record.thisDescription=record.description[0].value;
                  
              }
              if(record.description!=undefined && record.description.description_0!=undefined)
              {
                 record.thisDescription=record.description.description_0;
              }
          }
          if(record.thisDescription==undefined){
          record.thisDescription = " There is no defined description";}
          document.getElementById('description').innerHTML = record.thisDescription;
          
		  /* Title */
          if (record.alternative instanceof Object == false) 
          {
              if(record.alternative!=undefined)
              {
                  record.thisTitle=record.alternative;
              }
          }
          else
          {
              if(record.alternative!=undefined && record.alternative[0]!=undefined)
              {
                  record.thisTitle=record.alternative[0].value;
              }
              
          }
          if(record.thisTitle==undefined){record.thisTitle = " There is no defined title";}
          if(record.contextUri!=undefined )
          {
              document.getElementById('title').innerHTML = "<a href=\""+record.contextUri+"\" target=\"_blank\">"+record.thisTitle+"</a>";
          }
          else
          {
              document.getElementById('title').innerHTML = record.thisTitle;
          }
		  
        
        
        /* creator */
        if(record.creator!=undefined)
        {
        	document.getElementById('creator').innerHTML = record.creator;
        }
        /* subject */
        if(record.subject!=undefined)
        {
        	document.getElementById('subject').innerHTML = record.subject;
        }
        /* period */
        if(record.temporal!=undefined)
        {
        	document.getElementById('period').innerHTML = record.temporal;
        }
        /* geograph coverage */
        if(record.spatial!=undefined)
        {
        	document.getElementById('spatial').innerHTML = record.spatial;
        }
        /* publisher */
        if(record.publisher!=undefined)
        {
        	document.getElementById('publisher').innerHTML = record.publisher;
        }
        /* rights */
        if(record.rights!=undefined)
        {
        	document.getElementById('rights').innerHTML = record.rights;
        }
        
        /*common rights */
        if(record.licenseUri!=undefined)
        {
        	var common_rights = record.licenseUri;
            if(record.licenseUri.search("licenses/by-nc-sa")>=0)
            {
            	common_rights = '<nav  class="itemRights"><a href="'+record.licenseUri+'" class="secondary" target="_blank"><img style="display:inline;" src="images/cc/cc-by-nc-sa.png"></a></nav>';
            }
            else if(record.licenseUri.search("licenses/by-nc-nd")>=0)
            {
            	common_rights = '<nav  class="itemRights"><a href="'+record.licenseUri+'" class="secondary" target="_blank"><img style="display:inline;" src="images/cc/cc-by-nc-nd.png"></a></nav>';
            }
            else if(record.licenseUri.search("licenses/by-nd")>=0)
            {
            	common_rights = '<nav  class="itemRights"><a href="'+record.licenseUri+'" class="secondary" target="_blank"><img style="display:inline;" src="images/cc/cc-by-nd.png"></a></nav>';
            }
            else if(record.licenseUri.search("licenses/by-sa")>=0)
            {
            	common_rights = '<nav  class="itemRights"><a href="'+record.licenseUri+'" class="secondary" target="_blank"><img style="display:inline;" src="images/cc/cc-by-sa.png"></a></nav>';
            }
            else if(record.licenseUri.search("licenses/by-nc")>=0)
            {
            	common_rights = '<nav  class="itemRights"><a href="'+record.licenseUri+'" class="secondary" target="_blank"><img style="display:inline;" src="images/cc/cc-by-nc.png"></a></nav>';
            }
            else if(record.licenseUri.search("licenses/by")>=0)
            {
            	common_rights = '<nav  class="itemRights"><a href="'+record.licenseUri+'" class="secondary" target="_blank"><img style="display:inline;" src="images/cc/cc-by.png"></a></nav>';
            
            }
            else
            {
            	common_rights = '<span>Rights: </span><nav  class="itemRights"><a href="'+record.licenseUri+'" class="secondary" target="_blank">'+record.licenseUri+'</a></nav>';
            }
            
            
            document.getElementById('creative_commons').innerHTML = common_rights;
        }
        
        /* bottom menu */
        if(record.contextUri!=undefined)
        {
            document.getElementById('resource_actions').innerHTML = "<a href=\""+record.contextUri+"\" target=\"_blank\"> View Resource</a><a href=\"#\">Add for Annotation</a><a href=\"#\"> Download XML file</a>";
        }
        else
        {
            document.getElementById('resource_actions').innerHTML = "<a href=\"#\"> View Resource</a><a href=\"#\">Add for Annotation</a><a href=\"#\"> Download XML file</a>";
        }
        
        //end of -success- of getItemJSONP
        }})}


// ADD THE LINK TO THE BANNER IMAGES
function imageClick(url) {window.location = url;}

