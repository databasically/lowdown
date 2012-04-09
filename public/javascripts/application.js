// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults
$(document).ready(function(){

  // Update all milestones on the page
  window.updateMilestones = function(i, milestone) {
    $('#milestone_'+milestone.id).replaceWith(milestone.html);
  };

  // Add/remove a class on hover
  $.fn.hoverClass = function(className){
    var toggleClassName = function(){
      $(this).toggleClass(className);
    };
    return $(this).hover(toggleClassName, toggleClassName);
  };

  // Extract numeric ids from elements and strings
  $.extractID = function(id){
    return parseInt(id.match(/\d+/)[0]);
  };

  $.fn.extractID = function(){
    return $.extractID($(this).attr('id'));
  };

  // Find the target element of an anchor containing an id in its href
  $.fn.linkTarget = function(){
    var matchInfo = $(this).attr('href').match(/(#.*)$/);
    if(matchInfo){
      var anchor = matchInfo[1];
      return $(anchor);
    } else {
      return nil;
    }
  };

  // Project list sortable
  $('#main > ul.project[id]').sortable({
    axis: 'y',               // move only vertically
    cursor: 'ns-resize',
    cursorAt: 'top',
    opacity: 0.8,           // fade a little
    items: 'li.milestone, li.feature:not(#feature_new)', // exclude new features
    scroll: true,           // allow scrolling beyond viewport edge
    handle: 'li.top',
    update: function(event, ui){
      var list = $(this);
      var ids = $.map(list.sortable('toArray'), $.extractID);
      var project_id = list.extractID();
      var folder_id = $('h1.folder').extractID();
      $.post("/projects/"+project_id+"/folders/"+folder_id+"/reorder",
             $.param({"project_items[]": ids }),
        function(json){
          $.each(json, updateMilestones);
        }, 'json'
      );
    }
  });

//  $('#main li.feature').livequery(function(){
//    $(this).hover(function(){ $(this).find('.move_to_page').show(); },function(){ $(this).find('.move_to_page').hide(); });
//  });

  // Drag to other tabs
  $('#main li.feature .move_to_page').livequery(function(){
                                                   $(this).draggable({revert: 'invalid'});
                                               });


  // Droppable tabs
  $('#sidebar ul.pages li:not(.selected)').droppable({
    accept: '.move_to_page',
    hoverClass:'drophover',
    tolerance: 'pointer',
    drop: function(event, ui){
      var $handle = ui.draggable;
      var $feature = $handle.parents('li.feature');
      var $sortable = $feature.parents('.ui-sortable');
      var $this = $(this);
      var offsetTop = $this.offset().top - $feature.offset().top;
      var offsetLeft = $this.offset().left - $feature.offset().left;
      $handle.hide();
      var animateAndUpdate = function(json){
        $feature.css({position: 'relative'}).animate(
        {
          opacity: 0.0,
          fontSize: 0,
          height: $this.height() + 'px',
          width: $this.width() + 'px',
          top: offsetTop + 'px',
          left: offsetLeft + 'px'
        },
        750,
        function(){
          $feature.remove();
          $sortable.sortable('refresh');
        });
        $.each(json, updateMilestones);
      };
      $.status.show("Moving feature...");
      $.post($this.find('a').attr('href') + '/accept',
             $.param({'feature_id': $feature.extractID()}),
             animateAndUpdate,
            'json');
    }
  });

  // Sort value propositions and steps
  $('.edit_feature ol, .edit_scenario ol').livequery(function(){
    $(this).sortable({
      start: function(event, ui){
        var selector = $(ui).sortable('options', 'items');
        $(ui).find(selector).data('sorting', true);
      },
      stop: function(event, ui){
        var selector = $(ui).sortable('options', 'items');
        $(ui).find(selector).data('sorting', false);
      },
      axis: 'y',
      cursor: 'ns-resize',
      cursorAt: 'left',
      items: 'li[id]',
      forceHelperSize: true,
      forcePlaceHolderSize: true,
      tolerance: 'intersect',
      handle: '.handle img',
      scroll: true,
      opacity: 0.8
    });
  });

  // Sort scenarios within a feature
  $('form.new_feature ul.items, form.edit_feature ul.items').livequery(function(){
    $(this).sortable({
      start: function(event, ui){
        var selector = $(ui).sortable('options', 'items');
        $(ui).find(selector).data('sorting', true);
      },
      stop: function(event, ui){
        var selector = $(ui).sortable('options', 'items');
        $(ui).find(selector).data('sorting', false);
      },
      axis: 'y',
      cursor: 'ns-resize',
      cursorAt: 'left',
      items: 'li.edit_scenario',
      scroll: true,
      tolerance: 'intersect',
      opacity: 0.8,
      handle: 'li:first .handle img',
      delay: 200
    });
  });

  // Show drag handles
  $('li.edit_feature li[id], li.edit_scenario li:not(.add)').livequery(function(){
    $(this).mouseover(function(){
        clearTimeout($(this).data('hoverTimeout'));
        $(this).find('.handle').show();
    }).mouseout(function(){
      if(!$(this).data('sorting')){
       var th = $(this);
        $(this).data('hoverTimeout', setTimeout(function(){ th.find('.handle').hide(); }, 200));
      }
    });
  });

  // Remove value propositions, steps and scenarios
  $('.feature form a[rel=remove]').livequery('click', function(){
    if($(this).linkTarget() && ($(this).parents('li.add').length == 0 || confirm($(this).attr('title')+"?")))
      $($(this).attr('href')).remove();
    return false;
  });

  // Add a value proposition
  window.valuePropTemplate = $.template('\
    <li id="feature_${feature}_vp_${index}">\
      <div class="handle" style="display:none"><img src="/images/draggy.png" alt="move" /></div>\
      <div class="buttons">\
        <a title="Remove this line" rel="remove" href="#feature_${feature}_vp_${index}" class="negative">X</a>\
      </div>\
      <select name="feature[tree][value_prop][][label]" id="feature_tree_value_prop__label">\
        <option selected="selected" value=""></option>\
        <option value="In order to">In order to</option>\
        <option value="As a">As a</option>\
        <option value="I want">I want</option>\
      </select>\
      <input type="text" value="" name="feature[tree][value_prop][][value]" id="feature_tree_value_prop__value"/>\
      </li>', {compile: true});
  $('li.edit_feature li.add a').livequery('click', function(){
    var addLi = $(this).parents('li.add')
    var stepSiblings = addLi.siblings('*[id]');
    var feature = stepSiblings.extractID();
    var index = 0;
    $.each(stepSiblings, function(i, elem){
      id = parseInt($(elem).attr('id').match(/\d+$/)[0]);
      if(id >= index)
        index = id;
    });
    index += 1;
    addLi.before(window.valuePropTemplate.apply({feature: feature, index: index}));
    return false;
  });

  // Add a scenario step
  window.scenarioStepTemplate = $.template('\
    <li id="feature_${feature}_scenarios_${scenario}_step_${index}">\
      <div class="handle" style="display:none"><img src="/images/draggy.png" alt="move" /></div>\
      <div class="buttons">\
        <a title="Remove this step" rel="remove" href="#feature_${feature}_scenarios_${scenario}_step_${index}" class="negative">X</a>\
      </div>\
      <select name="feature[tree][elements][][steps][][keyword]" id="feature_tree_elements__steps__keyword">\
        <option value="Given">Given</option>\
        <option value="When">When</option>\
        <option value="Then">Then</option>\
        <option value="And">And</option>\
        <option value="But">But</option>\
      </select>\
      <input type="text" value="" name="feature[tree][elements][][steps][][name]" id="feature_tree_elements__steps__name"/>\
      <input type="hidden" value="" name="feature[tree][elements][][steps][][line]" id="feature_tree_elements__steps__line"/>\
    </li>', {compile: true});
  $('li.edit_scenario a[rel=add]').livequery('click', function(){
    var scenario = $(this).parents('.edit_scenario');
    var featureID = scenario.extractID();
    var scenarioID = scenario.attr('id').match(/\d+$/)[0];
    var stepSiblings = $(this).parents('li.add').siblings('li[id]');
    var index = 0;
    $.each(stepSiblings, function(i, elem){
      id = parseInt($(elem).attr('id').match(/\d+$/)[0]);
      if(id >= index)
        index = id;
    });
    index += 1;
    $(this).parents('li.add').before(window.scenarioStepTemplate.apply({'feature': featureID, 'scenario': scenarioID, 'index': index}));
    return false;
  });

  // Add an entire scenario
  window.scenarioTemplate = $.template('\
    <li id="feature_${feature}_scenarios_${scenario}" class="edit_scenario">\
      <div class="box">\
        <div class="inner">\
          <ol>\
            <li>\
              <div class="handle" style="display:none"><img src="/images/draggy.png" alt="move" /></div>\
              <label for="feature_${feature}_scenarios_${scenario}_name">SCENARIO</label>\
              <input type="text" value="" style="width: 363px;" name="feature[tree][elements][][name]" id="feature_${feature}_scenarios_${scenario}_name"/>\
              <label style="width: 55px;"> HOURS </label> \
              <input type="text" value="" style="width: 30px;" name="feature[tree][elements][][comments][]" id="feature_${feature}_scenarios_${scenario}_estimate"/>\
              <input type="hidden" value="" name="feature[tree][elements][][line]" id="feature_tree_elements__line"/>\
              <input type="hidden" value="scenario" name="feature[tree][elements][][type]" id="feature_tree_elements__type"/>\
            </li>\
            <li class="add">\
              <div class="buttons">\
                <a title="Add another step" rel="add" href="#">add new step</a>\
                <a title="Remove this scenario" rel="remove" href="#feature_${feature}_scenarios_${scenario}" class="negative">remove scenario</a>\
                <div class="clear"></div>\
              </div>\
            </li>\
          </ol>\
        </div>\
      </div>\
      <div class="clear"></div>\
    </li>', {compile: true});
  $('.feature form a.new_scenario').livequery('click', function(){
    var feature = $(this).parents('.feature').attr('id').match(/(new|\d+)$/)[1];
    var scenarios = $(this).parents('li.footer').siblings('li[id]');
    var scenario = 0;
    $.each(scenarios, function(i, elem){
      id = parseInt($(elem).attr('id').match(/\d+$/)[0]);
      if(id >= scenario)
        scenario = id;
    });
    scenario += 1;
    // this feels totally hackish... need more elegant solution
    var scenarioElem = $(window.scenarioTemplate.apply({'feature': feature, 'scenario': scenario}));
    $(this).parents('li.footer').before(scenarioElem);
    var addLi = scenarioElem.find('li.add');
    addLi.before(window.scenarioStepTemplate.apply({'feature': feature, 'scenario': scenario, 'index': 1}));
    addLi.before(window.scenarioStepTemplate.apply({'feature': feature, 'scenario': scenario, 'index': 2}));
    addLi.before(window.scenarioStepTemplate.apply({'feature': feature, 'scenario': scenario, 'index': 3}));
    $('select:nth(1)', scenarioElem).val('When');
    $('select:nth(2)', scenarioElem).val('Then');
    return false;
  });

  // Sync field with title
  $('li.edit_feature input:first').livequery('keyup', function(){
    var title = $(this).parents('.drawer').siblings('.top').find('.value')
    title.html($.trim($(this).val()));
    return true;
  });

  // Delete via Ajax
  $('.milestone a.delete_milestone, .feature a.delete_feature, a.delete_project').livequery('click', function(){
    if(confirm($(this).attr('title') + "?")){
        $.status.show("Deleting...");
        $.post($(this).attr('href'),
          {'_method' : 'delete', 'format': 'js'},
          function(content){ },
          'script');
    }
    return false;
  });

  // Feature Ajax submission
  $('form.new_feature, form.edit_feature').livequery('submit', function(){
    var old_element = $(this).parents('.feature');
    $.status.show("Saving...");
    $.ajax({
      url: $(this).attr('action'),
      data: $(this).serializeArray(),
      type: 'POST',
      error: function(xhr, status, error){
        alert("Your feature could not be saved. Please check the form and try again.\n" + (error || status));
        $.status.hide();
      },
      success: function(content){
        var new_element = $(content);
        old_element.replaceWith(new_element);
        $.status.hide();
      },
      dataType: 'html'
    });
    return false;
  });

  // Enables save-and-close vs. save-and-keep-editing
  $('form.new_feature button[name], form.edit_feature button[name]').livequery('click', function(event){
    event.preventDefault();
    $(this).parents('form').find('input[name='+$(this).attr('name')+']').val($(this).attr('value'));
    $(this).parents('form').submit();
  });

  // Cancel form
  $('form.new_feature a.cancel, form.edit_feature a.cancel').livequery('click', function(){
    var form = $(this).parents(form);
    if(form.hasClass('new_feature')){
      var feature = form.parents('.feature');
        $.status.show("Deleting...");
        $.scrollUpBy(feature.height(), function(){
            $.status.hide();
            feature.fadeOut(500, function(){ $(this).remove(); });});
    } else {
      $.status.show("Canceling edits...");
      $(this).parents('.drawer').toggle('blind');
      $.get($(this).attr('href'), {}, function(content){
        var dom = $(content);
        if(dom) {
          form.parents('.feature').replaceWith(dom);
          dom.scrollTo();
        }
      }, 'html');
    }
    return false;
  });

  // Inline edit folder name form
    $('h1.folder').each(function(){
                          var $this = $(this);
                          var url = $this.attr('data-url');
                          var token = $this.attr('data-token');
                          $this.editable(url, {
                                           name: 'folder[name]',
                                           type: 'text',
                                           cancel: null,
                                           submit: null,
                                           select: true,
                                           onblur: 'cancel',
                                           submitdata: $.param({authenticity_token: token}),
                                           method: 'PUT',
                                           width: 'inherit',
                                           height: '18px',
                                           ajaxoptions: {dataType: 'json'},
                                           callback: function(result, settings){
                                             $(this).html(result.name);
                                             $('li#folder_'+result.id).find('a').html(result.name);
                                           },
                                           onsubmit: function(){
                                             $.status.show("Saving...");
                                           }
                                         });
                        });//.hoverClass('editable');

  // Trigger edit feature form
  $('.feature a.edit_feature').livequery('click', function(){
    $.status.show("Loading...");
    $(this).parents('.feature').find('.middle a.edit_feature').hide();
    var drawer = $(this).parents('.feature').find('.drawer');
    $.get($(this).attr('href'), {}, function(content){
      var dom = $(content);
      if(dom) {
        drawer.replaceWith(dom);
        dom.scrollTo(function(){ dom.find('li.edit_feature input:first').focus().select(); });
      }
    }, 'html');
    return false;
  });

  // Toggle drawer of full text or form
  $('.feature .buttons a[rel=toggle]').livequery('click', function(){
    if(!$(this).is('.feature#feature_new a')){
      var feature = $(this).parents('.feature');
      var drawer = feature.find('.drawer');
      if(drawer.is(':hidden') && drawer.find('form').size() == 0)
        $(this).parents('.feature').find('a.edit_feature, a.delete_feature').show();
      else
        $(this).parents('.feature').find('a.edit_feature, a.delete_feature').hide();
      drawer.toggle('blind');
      feature.find('a[rel=toggle] span.toggle').toggle();
    }
    return false;
  });

  $('li.toggle label').livequery('click', function(){
    $(this).parent().siblings('li').toggle();
  });

  // Add a new feature to the project (adds form)
  $('a#new_feature, a#new_milestone').click(function(){
    $.status.show("Loading...");
    var method = $(this).is("#new_milestone") ? $.post : $.get;
    method($(this).attr('href'), {}, function(content){
      var dom = $(content);
      if(dom) {
        $('#main > ul').append(dom);
        dom.scrollTo(function(){ dom.find('li.edit_feature input:first').focus().select(); });
      }
    }, 'html');
    return false;
  });

  // Toggle the OpenID view
  $('#login_toggle a.toggle').click(function(){
    $('a.toggle').not($(this)).each(function(){
                                      $(this).show().linkTarget().hide();
                                    });
    $(this).hide().linkTarget().show();
    return false;
  });

	$('#open_id #providers a').click(function(){
		var href = $(this).attr('href');
		if(href.match("username")){
			$("li#openid_username").show();
			$("li#openid_username input#openid_username").focus();
			$("#user_openid_identifier, #user_session_openid_identifier").val(href);
		}else{
			$("li#openid_username").hide();
			$("#user_openid_identifier, #user_session_openid_identifier").val(href);
		}
		return false;
	});

	//submit openid form on enter
	$("input#openid_username").keypress(function(e){
		if(e.which == 13){
			$('#openid-login div.buttons button, #openid-signup div.buttons button').click();
		}
	});

	$('#openid-login div.buttons button, #openid-signup div.buttons button').click(function(){
		var merge_username = $("li#openid_username").is(":visible");
		if(merge_username){
			var href = $("#user_session_openid_identifier, #user_openid_identifier").val();
			var username = $("input#openid_username").val();
			$("#user_session_openid_identifier, #user_openid_identifier").val(href.replace("username",username));
			$("li#openid_username").hide();
		}
		// return false;
	});

  // Autocomplete member email addresses
  $('form#add_members_form input[name=email]').autocomplete({
      url: '/users/by_email',
      template: '<li><span class="value">${email}</span> (${name})</li>',
      itemsKey: 'users',
      param: 'email'
   });

  // Select a project from dropdown
  $('select#project_id').change(function(){
    if($.trim($(this).attr('value')).length != 0)
      window.location.href = '/projects/'+$(this).attr('value');
  });

  //submit project settings form
  $('button#update_project').click(function(){
    $('form.edit_project').submit();
   });

  //limit character input on .limit classed fields
   $('.limit').keypress(function(){
     var max = $(this).attr('size')-1;
     if ($(this).val().length > max){
       $(this).val($(this).val().substring(0,max));
     }
   });

});


