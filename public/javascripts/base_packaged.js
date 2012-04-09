(function($){$.fn.autocomplete=function(options){var $this=$(this);var opts=$.extend({param:$this.attr('name'),url:$this.parents('form').attr('action'),template:'<li><span class="value">${value}</span></li>',valueSelector:'span.value',itemSelector:'li',delay:250,itemsKey:'values',highlightClass:'selected'},options);var $list=$('<ul class="autocomplete" />').hide();$this.after($list);$list.click(function(e){var $target=$(e.target);var self=$target.filter(opts.valueSelector);var siblings=$target.siblings(opts.valueSelector);var children=$target.find(opts.valueSelector);self.add(siblings).add(children)
complete(self);e.preventDefault();});var ajaxCallback=function(){var params={};params[opts.param]=$this.val();$.getJSON(opts.url,params,function(data){$list.empty();if(opts.itemsKey)
data=data[opts.itemsKey];if(data.length>0){$.each(data,function(i,item){$list.append($.template(opts.template).apply(item));});$list.fadeIn(200);}else
$list.fadeOut(200);});};var complete=function(value){if(value.length>0){$this.val(value.text());$list.empty().hide();}};var highlight=function(which){$list.find(opts.itemSelector).removeClass(opts.highlightClass);$($list.find(opts.itemSelector).eq(which)).addClass(opts.highlightClass);};var highlightPrev=function(){var selected=$list.find('.'+opts.highlightClass);if(selected.length==0){highlight(0);}else{var items=$list.find(opts.itemSelector);var currindex=items.index(selected);highlight((currindex+items.length-1)%items.length);}};var highlightNext=function(){var selected=$list.find('.'+opts.highlightClass);if(selected.length==0){highlight(0);}else{var items=$list.find(opts.itemSelector);var currindex=items.index(selected);highlight((currindex+1)%items.length);}};var scheduleAutocomplete=function(){clearTimeout($this.data('autocomplete_timeout'));$this.data('autocomplete_timeout',setTimeout(ajaxCallback,opts.delay));};$this.keydown(function(e){switch(e.keyCode){case 27:$list.fadeOut(200);break;case 37:case 38:highlightPrev();e.preventDefault();break;case 39:case 40:highlightNext();e.preventDefault();break;case 9:case 13:var highlighted=$list.find("."+opts.highlightClass);if(highlighted.length>0){e.preventDefault();complete(highlighted.find(opts.valueSelector));}
if(e.keyCode==13&&$list.is(':visible'))
e.preventDefault();break;default:scheduleAutocomplete();}});$this.focus(function(){if($list.find(opts.itemSelector).length>0){$list.fadeIn(200).find(opts.itemSelector).removeClass(opts.highlightClass);}});$this.blur(function(){setTimeout(function(){$list.fadeOut(200);},opts.delay);});};})(jQuery);(function($){$.fn.scrollTo=function(callback){var duration=arguments[0]||1000;$('html, body').animate({scrollTop:$(this).offset().top},duration,callback);return $(this);};$.scrollUpBy=function(amount,callback){var duration=arguments[0]||250;var newPosition=$('html, body').scrollTop()-amount;if(newPosition<0)newPosition=0;$('html, body').animate({scrollTop:newPosition},duration,callback);}})(jQuery);(function($){$.extend($.fn,{livequery:function(type,fn,fn2){var self=this,q;if($.isFunction(type))
fn2=fn,fn=type,type=undefined;$.each($.livequery.queries,function(i,query){if(self.selector==query.selector&&self.context==query.context&&type==query.type&&(!fn||fn.$lqguid==query.fn.$lqguid)&&(!fn2||fn2.$lqguid==query.fn2.$lqguid))
return(q=query)&&false;});q=q||new $.livequery(this.selector,this.context,type,fn,fn2);q.stopped=false;q.run();return this;},expire:function(type,fn,fn2){var self=this;if($.isFunction(type))
fn2=fn,fn=type,type=undefined;$.each($.livequery.queries,function(i,query){if(self.selector==query.selector&&self.context==query.context&&(!type||type==query.type)&&(!fn||fn.$lqguid==query.fn.$lqguid)&&(!fn2||fn2.$lqguid==query.fn2.$lqguid)&&!this.stopped)
$.livequery.stop(query.id);});return this;}});$.livequery=function(selector,context,type,fn,fn2){this.selector=selector;this.context=context||document;this.type=type;this.fn=fn;this.fn2=fn2;this.elements=[];this.stopped=false;this.id=$.livequery.queries.push(this)-1;fn.$lqguid=fn.$lqguid||$.livequery.guid++;if(fn2)fn2.$lqguid=fn2.$lqguid||$.livequery.guid++;return this;};$.livequery.prototype={stop:function(){var query=this;if(this.type)
this.elements.unbind(this.type,this.fn);else if(this.fn2)
this.elements.each(function(i,el){query.fn2.apply(el);});this.elements=[];this.stopped=true;},run:function(){if(this.stopped)return;var query=this;var oEls=this.elements,els=$(this.selector,this.context),nEls=els.not(oEls);this.elements=els;if(this.type){nEls.bind(this.type,this.fn);if(oEls.length>0)
$.each(oEls,function(i,el){if($.inArray(el,els)<0)
$.event.remove(el,query.type,query.fn);});}
else{nEls.each(function(){query.fn.apply(this);});if(this.fn2&&oEls.length>0)
$.each(oEls,function(i,el){if($.inArray(el,els)<0)
query.fn2.apply(el);});}}};$.extend($.livequery,{guid:0,queries:[],queue:[],running:false,timeout:null,checkQueue:function(){if($.livequery.running&&$.livequery.queue.length){var length=$.livequery.queue.length;while(length--)
$.livequery.queries[$.livequery.queue.shift()].run();}},pause:function(){$.livequery.running=false;},play:function(){$.livequery.running=true;$.livequery.run();},registerPlugin:function(){$.each(arguments,function(i,n){if(!$.fn[n])return;var old=$.fn[n];$.fn[n]=function(){var r=old.apply(this,arguments);$.livequery.run();return r;}});},run:function(id){if(id!=undefined){if($.inArray(id,$.livequery.queue)<0)
$.livequery.queue.push(id);}
else
$.each($.livequery.queries,function(id){if($.inArray(id,$.livequery.queue)<0)
$.livequery.queue.push(id);});if($.livequery.timeout)clearTimeout($.livequery.timeout);$.livequery.timeout=setTimeout($.livequery.checkQueue,20);},stop:function(id){if(id!=undefined)
$.livequery.queries[id].stop();else
$.each($.livequery.queries,function(id){$.livequery.queries[id].stop();});}});$.livequery.registerPlugin('append','prepend','after','before','wrap','attr','removeAttr','addClass','removeClass','toggleClass','empty','remove');$(function(){$.livequery.play();});var init=$.prototype.init;$.prototype.init=function(a,c){var r=init.apply(this,arguments);if(a&&a.selector)
r.context=a.context,r.selector=a.selector;if(typeof a=='string')
r.context=c||document,r.selector=a;return r;};$.prototype.init.prototype=$.prototype;})(jQuery);(function($){$.template=function(html,options){return new $.template.instance(html,options);};$.template.instance=function(html,options){if(options&&options['regx'])options.regx=this.regx[options.regx];this.options=$.extend({compile:false,regx:this.regx.standard},options||{});this.html=html;if(this.options.compile){this.compile();}
this.isTemplate=true;};$.template.regx=$.template.instance.prototype.regx={jsp:/\$\{([\w-]+)(?:\:([\w\.]*)(?:\((.*?)?\))?)?\}/g,ext:/\{([\w-]+)(?:\:([\w\.]*)(?:\((.*?)?\))?)?\}/g,jtemplates:/\{\{([\w-]+)(?:\:([\w\.]*)(?:\((.*?)?\))?)?\}\}/g};$.template.regx.standard=$.template.regx.jsp;$.template.helpers=$.template.instance.prototype.helpers={substr:function(value,start,length){return String(value).substr(start,length);}};$.extend($.template.instance.prototype,{apply:function(values){if(this.options.compile){return this.compiled(values);}else{var tpl=this;var fm=this.helpers;var fn=function(m,name,format,args){if(format){if(format.substr(0,5)=="this."){return tpl.call(format.substr(5),values[name],values);}else{if(args){var re=/^\s*['"](.*)["']\s*$/;args=args.split(',');for(var i=0,len=args.length;i<len;i++){args[i]=args[i].replace(re,"$1");}
args=[values[name]].concat(args);}else{args=[values[name]];}
return fm[format].apply(fm,args);}}else{return values[name]!==undefined?values[name]:"";}};return this.html.replace(this.options.regx,fn);}},compile:function(){var sep=$.browser.mozilla?"+":",";var fm=this.helpers;var fn=function(m,name,format,args){if(format){args=args?','+args:"";if(format.substr(0,5)!="this."){format="fm."+format+'(';}else{format='this.call("'+format.substr(5)+'", ';args=", values";}}else{args='';format="(values['"+name+"'] == undefined ? '' : ";}
return"'"+sep+format+"values['"+name+"']"+args+")"+sep+"'";};var body;if($.browser.mozilla){body="this.compiled = function(values){ return '"+
this.html.replace(/\\/g,'\\\\').replace(/(\r\n|\n)/g,'\\n').replace(/'/g,"\\'").replace(this.options.regx,fn)+"';};";}else{body=["this.compiled = function(values){ return ['"];body.push(this.html.replace(/\\/g,'\\\\').replace(/(\r\n|\n)/g,'\\n').replace(/'/g,"\\'").replace(this.options.regx,fn));body.push("'].join('');};");body=body.join('');}
eval(body);return this;}});var $_old={domManip:$.fn.domManip,text:$.fn.text,html:$.fn.html};$.fn.domManip=function(args,table,reverse,callback){if(args[0].isTemplate){args[0]=args[0].apply(args[1]);delete args[1];}
var r=$_old.domManip.apply(this,arguments);return r;};$.fn.html=function(value,o){if(value&&value.isTemplate)var value=value.apply(o);var r=$_old.html.apply(this,[value]);return r;};$.fn.text=function(value,o){if(value&&value.isTemplate)var value=value.apply(o);var r=$_old.text.apply(this,[value]);return r;};})(jQuery);;(function($){$.fn.ajaxSubmit=function(options){if(!this.length){log('ajaxSubmit: skipping submit process - no element selected');return this;}
if(typeof options=='function')
options={success:options};var url=$.trim(this.attr('action'));if(url){url=(url.match(/^([^#]+)/)||[])[1];}
url=url||window.location.href||''
options=$.extend({url:url,type:this.attr('method')||'GET'},options||{});var veto={};this.trigger('form-pre-serialize',[this,options,veto]);if(veto.veto){log('ajaxSubmit: submit vetoed via form-pre-serialize trigger');return this;}
if(options.beforeSerialize&&options.beforeSerialize(this,options)===false){log('ajaxSubmit: submit aborted via beforeSerialize callback');return this;}
var a=this.formToArray(options.semantic);if(options.data){options.extraData=options.data;for(var n in options.data){if(options.data[n]instanceof Array){for(var k in options.data[n])
a.push({name:n,value:options.data[n][k]});}
else
a.push({name:n,value:options.data[n]});}}
if(options.beforeSubmit&&options.beforeSubmit(a,this,options)===false){log('ajaxSubmit: submit aborted via beforeSubmit callback');return this;}
this.trigger('form-submit-validate',[a,this,options,veto]);if(veto.veto){log('ajaxSubmit: submit vetoed via form-submit-validate trigger');return this;}
var q=$.param(a);if(options.type.toUpperCase()=='GET'){options.url+=(options.url.indexOf('?')>=0?'&':'?')+q;options.data=null;}
else
options.data=q;var $form=this,callbacks=[];if(options.resetForm)callbacks.push(function(){$form.resetForm();});if(options.clearForm)callbacks.push(function(){$form.clearForm();});if(!options.dataType&&options.target){var oldSuccess=options.success||function(){};callbacks.push(function(data){$(options.target).html(data).each(oldSuccess,arguments);});}
else if(options.success)
callbacks.push(options.success);options.success=function(data,status){for(var i=0,max=callbacks.length;i<max;i++)
callbacks[i].apply(options,[data,status,$form]);};var files=$('input:file',this).fieldValue();var found=false;for(var j=0;j<files.length;j++)
if(files[j])
found=true;var multipart=false;if(options.iframe||found||multipart){if(options.closeKeepAlive)
$.get(options.closeKeepAlive,fileUpload);else
fileUpload();}
else
$.ajax(options);this.trigger('form-submit-notify',[this,options]);return this;function fileUpload(){var form=$form[0];if($(':input[name=submit]',form).length){alert('Error: Form elements must not be named "submit".');return;}
var opts=$.extend({},$.ajaxSettings,options);var s=$.extend(true,{},$.extend(true,{},$.ajaxSettings),opts);var id='jqFormIO'+(new Date().getTime());var $io=$('<iframe id="'+id+'" name="'+id+'" src="about:blank" />');var io=$io[0];$io.css({position:'absolute',top:'-1000px',left:'-1000px'});var xhr={aborted:0,responseText:null,responseXML:null,status:0,statusText:'n/a',getAllResponseHeaders:function(){},getResponseHeader:function(){},setRequestHeader:function(){},abort:function(){this.aborted=1;$io.attr('src','about:blank');}};var g=opts.global;if(g&&!$.active++)$.event.trigger("ajaxStart");if(g)$.event.trigger("ajaxSend",[xhr,opts]);if(s.beforeSend&&s.beforeSend(xhr,s)===false){s.global&&$.active--;return;}
if(xhr.aborted)
return;var cbInvoked=0;var timedOut=0;var sub=form.clk;if(sub){var n=sub.name;if(n&&!sub.disabled){options.extraData=options.extraData||{};options.extraData[n]=sub.value;if(sub.type=="image"){options.extraData[name+'.x']=form.clk_x;options.extraData[name+'.y']=form.clk_y;}}}
setTimeout(function(){var t=$form.attr('target'),a=$form.attr('action');form.setAttribute('target',id);if(form.getAttribute('method')!='POST')
form.setAttribute('method','POST');if(form.getAttribute('action')!=opts.url)
form.setAttribute('action',opts.url);if(!options.skipEncodingOverride){$form.attr({encoding:'multipart/form-data',enctype:'multipart/form-data'});}
if(opts.timeout)
setTimeout(function(){timedOut=true;cb();},opts.timeout);var extraInputs=[];try{if(options.extraData)
for(var n in options.extraData)
extraInputs.push($('<input type="hidden" name="'+n+'" value="'+options.extraData[n]+'" />').appendTo(form)[0]);$io.appendTo('body');io.attachEvent?io.attachEvent('onload',cb):io.addEventListener('load',cb,false);form.submit();}
finally{form.setAttribute('action',a);t?form.setAttribute('target',t):$form.removeAttr('target');$(extraInputs).remove();}},10);var nullCheckFlag=0;function cb(){if(cbInvoked++)return;io.detachEvent?io.detachEvent('onload',cb):io.removeEventListener('load',cb,false);var ok=true;try{if(timedOut)throw'timeout';var data,doc;doc=io.contentWindow?io.contentWindow.document:io.contentDocument?io.contentDocument:io.document;if((doc.body==null||doc.body.innerHTML=='')&&!nullCheckFlag){nullCheckFlag=1;cbInvoked--;setTimeout(cb,100);return;}
xhr.responseText=doc.body?doc.body.innerHTML:null;xhr.responseXML=doc.XMLDocument?doc.XMLDocument:doc;xhr.getResponseHeader=function(header){var headers={'content-type':opts.dataType};return headers[header];};if(opts.dataType=='json'||opts.dataType=='script'){var ta=doc.getElementsByTagName('textarea')[0];xhr.responseText=ta?ta.value:xhr.responseText;}
else if(opts.dataType=='xml'&&!xhr.responseXML&&xhr.responseText!=null){xhr.responseXML=toXml(xhr.responseText);}
data=$.httpData(xhr,opts.dataType);}
catch(e){ok=false;$.handleError(opts,xhr,'error',e);}
if(ok){opts.success(data,'success');if(g)$.event.trigger("ajaxSuccess",[xhr,opts]);}
if(g)$.event.trigger("ajaxComplete",[xhr,opts]);if(g&&!--$.active)$.event.trigger("ajaxStop");if(opts.complete)opts.complete(xhr,ok?'success':'error');setTimeout(function(){$io.remove();xhr.responseXML=null;},100);};function toXml(s,doc){if(window.ActiveXObject){doc=new ActiveXObject('Microsoft.XMLDOM');doc.async='false';doc.loadXML(s);}
else
doc=(new DOMParser()).parseFromString(s,'text/xml');return(doc&&doc.documentElement&&doc.documentElement.tagName!='parsererror')?doc:null;};};};$.fn.ajaxForm=function(options){return this.ajaxFormUnbind().bind('submit.form-plugin',function(){$(this).ajaxSubmit(options);return false;}).each(function(){$(":submit,input:image",this).bind('click.form-plugin',function(e){var form=this.form;form.clk=this;if(this.type=='image'){if(e.offsetX!=undefined){form.clk_x=e.offsetX;form.clk_y=e.offsetY;}else if(typeof $.fn.offset=='function'){var offset=$(this).offset();form.clk_x=e.pageX-offset.left;form.clk_y=e.pageY-offset.top;}else{form.clk_x=e.pageX-this.offsetLeft;form.clk_y=e.pageY-this.offsetTop;}}
setTimeout(function(){form.clk=form.clk_x=form.clk_y=null;},10);});});};$.fn.ajaxFormUnbind=function(){this.unbind('submit.form-plugin');return this.each(function(){$(":submit,input:image",this).unbind('click.form-plugin');});};$.fn.formToArray=function(semantic){var a=[];if(this.length==0)return a;var form=this[0];var els=semantic?form.getElementsByTagName('*'):form.elements;if(!els)return a;for(var i=0,max=els.length;i<max;i++){var el=els[i];var n=el.name;if(!n)continue;if(semantic&&form.clk&&el.type=="image"){if(!el.disabled&&form.clk==el){a.push({name:n,value:$(el).val()});a.push({name:n+'.x',value:form.clk_x},{name:n+'.y',value:form.clk_y});}
continue;}
var v=$.fieldValue(el,true);if(v&&v.constructor==Array){for(var j=0,jmax=v.length;j<jmax;j++)
a.push({name:n,value:v[j]});}
else if(v!==null&&typeof v!='undefined')
a.push({name:n,value:v});}
if(!semantic&&form.clk){var $input=$(form.clk),input=$input[0],n=input.name;if(n&&!input.disabled&&input.type=='image'){a.push({name:n,value:$input.val()});a.push({name:n+'.x',value:form.clk_x},{name:n+'.y',value:form.clk_y});}}
return a;};$.fn.formSerialize=function(semantic){return $.param(this.formToArray(semantic));};$.fn.fieldSerialize=function(successful){var a=[];this.each(function(){var n=this.name;if(!n)return;var v=$.fieldValue(this,successful);if(v&&v.constructor==Array){for(var i=0,max=v.length;i<max;i++)
a.push({name:n,value:v[i]});}
else if(v!==null&&typeof v!='undefined')
a.push({name:this.name,value:v});});return $.param(a);};$.fn.fieldValue=function(successful){for(var val=[],i=0,max=this.length;i<max;i++){var el=this[i];var v=$.fieldValue(el,successful);if(v===null||typeof v=='undefined'||(v.constructor==Array&&!v.length))
continue;v.constructor==Array?$.merge(val,v):val.push(v);}
return val;};$.fieldValue=function(el,successful){var n=el.name,t=el.type,tag=el.tagName.toLowerCase();if(typeof successful=='undefined')successful=true;if(successful&&(!n||el.disabled||t=='reset'||t=='button'||(t=='checkbox'||t=='radio')&&!el.checked||(t=='submit'||t=='image')&&el.form&&el.form.clk!=el||tag=='select'&&el.selectedIndex==-1))
return null;if(tag=='select'){var index=el.selectedIndex;if(index<0)return null;var a=[],ops=el.options;var one=(t=='select-one');var max=(one?index+1:ops.length);for(var i=(one?index:0);i<max;i++){var op=ops[i];if(op.selected){var v=op.value;if(!v)
v=(op.attributes&&op.attributes['value']&&!(op.attributes['value'].specified))?op.text:op.value;if(one)return v;a.push(v);}}
return a;}
return el.value;};$.fn.clearForm=function(){return this.each(function(){$('input,select,textarea',this).clearFields();});};$.fn.clearFields=$.fn.clearInputs=function(){return this.each(function(){var t=this.type,tag=this.tagName.toLowerCase();if(t=='text'||t=='password'||tag=='textarea')
this.value='';else if(t=='checkbox'||t=='radio')
this.checked=false;else if(tag=='select')
this.selectedIndex=-1;});};$.fn.resetForm=function(){return this.each(function(){if(typeof this.reset=='function'||(typeof this.reset=='object'&&!this.reset.nodeType))
this.reset();});};$.fn.enable=function(b){if(b==undefined)b=true;return this.each(function(){this.disabled=!b;});};$.fn.selected=function(select){if(select==undefined)select=true;return this.each(function(){var t=this.type;if(t=='checkbox'||t=='radio')
this.checked=select;else if(this.tagName.toLowerCase()=='option'){var $sel=$(this).parent('select');if(select&&$sel[0]&&$sel[0].type=='select-one'){$sel.find('option').selected(false);}
this.selected=select;}});};function log(){if($.fn.ajaxSubmit.debug&&window.console&&window.console.log)
window.console.log('[jquery.form] '+Array.prototype.join.call(arguments,''));};})(jQuery);(function($){document.viewport={getDimensions:function(){return{'width':document.documentElement.clientWidth,'height':document.documentElement.clientHeight};},getWidth:function(){return this.getDimensions().width;},getHeight:function(){return this.getDimensions().height;},getScrollOffsets:function(){return{'left':(window.pageXOffset||document.documentElement.scrollLeft||document.body.scrollLeft),'top':(window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop)};}};var status={cornerThickness:12,spinnerImage:'/images/status_spinner.gif',spinnerImageWidth:32,spinnerImageHeight:33,backgroundImage:'/images/status_background.png',topLeftImage:'/images/status_top_left.png',topRightImage:'/images/status_top_right.png',bottomLeftImage:'/images/status_bottom_left.png',bottomRightImage:'/images/status_bottom_right.png',modal:true}
status.backgroundImages=function(){return[status.spinnerImage,status.backgroundImage,status.topLeftImage,status.topRightImage,status.bottomLeftImage,status.bottomRightImage];};status.preloadImages=function(){if(!status.imagesPreloaded){$.each(status.backgroundImages(),function(i,src){var image=new Image();image.src=src;});status.preloadedImages=true;}};status.buildWindow=function(){if($('table.status_window').length!=0)return;if(!status.windowTemplate)
status.windowTemplate=$.template('\
        <table class="status_window" style="display: none; position: absolute; border-collapse: collapse; padding: 0px; margin: 0px; z-index: 10000">\
          <tbody>\
            <tr>\
              <td style="background: url(${topLeftImage}); height: ${cornerThickness}px; width: ${cornerThickness}px; padding: 0px;"></td>\
              <td style="background: url(${backgroundImage}); height: ${cornerThickness}px; padding: 0px;"></td>\
              <td style="background: url(${topRightImage}); height: ${cornerThickness}px; width: ${cornerThickness}px; padding: 0px;"></td>\
            </tr>\
            <tr>\
              <td style="background: url(${backgroundImage}); width: ${cornerThickness}px; padding: 0px;"></td>\
              <td class="status_content" style="background: url(${backgroundImage}); padding: 0px ${cornerThickness}px;">\
                <table border="0" cellpadding="0" cellspacing="0" style="table-layout: auto">\
                  <tbody>\
                    <tr>\
                      <td style="width: ${spinnerImageWidth}px"><img src="${spinnerImage}" width="${spinnerImageWidth}" height="${spinnerImageHeight}" alt="" /></td>\
                      <td style="padding-left: ${cornerThickness}px;"><div></div></td>\
                    </tr>\
                  </tbody>\
                </table>\
              </td>\
              <td style="background: url(${backgroundImage}); width: ${cornerThickness}px; padding: 0px;"></td>\
            </tr>\
            <tr>\
              <td style="background: url(${bottomLeftImage}); height: ${cornerThickness}px; width: ${cornerThickness}px; padding: 0px;"></td>\
              <td style="background: url(${backgroundImage}); height: ${cornerThickness}px; padding: 0px;"></td>\
              <td style="background: url(${bottomRightImage}); height: ${cornerThickness}px; width: ${cornerThickness}px; padding: 0px;"></td>\
            </tr>\
          </tbody>\
        </table>');$(document.body).append(status.windowTemplate.apply(status));};status.hide=function(){if(status.modal)status.hideOverlay();return $('table.status_window').fadeOut(250);};status.show=function(){status.buildWindow();if(arguments[0])
$('.status_content div').text(arguments[0]);if(status.modal)status.showOverlay();return $('table.status_window').show().centerInViewport();};status.buildOverlay=function(){if($('div.status_overlay').length!=0)
return;$('body').append($.template('<div class="status_overlay" style="display: none; position: absolute; background-color:white; top:0px; left:0px; z-index:100; height: ${height}px; width: ${width}px; opacity: 0.01"></div>').apply(document.viewport.getDimensions()));};status.showOverlay=function(){status.buildOverlay();return $('.status_overlay').show();};status.hideOverlay=function(){return $('.status_overlay').hide();};$(status.preloadImages);$.extend({status:status});$.fn.extend({status:function(){if($(this).is('a[onclick_status]'))
$(this).click(function(){status.show($(this).attr('onclick_status'));});if($(this).is('form[onsubmit_status]'))
$(this).submit(function(){status.show($(this).attr('onsubmit_status'));});},centerInViewport:function(){var offsets=document.viewport.getScrollOffsets();$(this).css({'left':parseInt((document.viewport.getWidth()-$(this).outerWidth())/2)+'px','top':parseInt((document.viewport.getHeight()-$(this).outerHeight())/2.2)+'px','position':'fixed'});return this;}});$(document.body).ajaxStop(function(){$.status.hide();});})(jQuery);(function($){$.fn.editable=function(target,options){if('disable'==target){$(this).data('disabled.editable',true);return;}
if('enable'==target){$(this).data('disabled.editable',false);return;}
if('destroy'==target){$(this).unbind($(this).data('event.editable')).removeData('disabled.editable').removeData('event.editable');return;}
var settings=$.extend({},$.fn.editable.defaults,{target:target},options);var plugin=$.editable.types[settings.type].plugin||function(){};var submit=$.editable.types[settings.type].submit||function(){};var buttons=$.editable.types[settings.type].buttons||$.editable.types['defaults'].buttons;var content=$.editable.types[settings.type].content||$.editable.types['defaults'].content;var element=$.editable.types[settings.type].element||$.editable.types['defaults'].element;var reset=$.editable.types[settings.type].reset||$.editable.types['defaults'].reset;var callback=settings.callback||function(){};var onedit=settings.onedit||function(){};var onsubmit=settings.onsubmit||function(){};var onreset=settings.onreset||function(){};var onerror=settings.onerror||reset;if(settings.tooltip){$(this).attr('title',settings.tooltip);}
settings.autowidth='auto'==settings.width;settings.autoheight='auto'==settings.height;return this.each(function(){var self=this;var savedwidth=$(self).width();var savedheight=$(self).height();$(this).data('event.editable',settings.event);if(!$.trim($(this).html())){$(this).html(settings.placeholder);}
$(this).bind(settings.event,function(e){if(true===$(this).data('disabled.editable')){return;}
if(self.editing){return;}
if(false===onedit.apply(this,[settings,self])){return;}
e.preventDefault();e.stopPropagation();if(settings.tooltip){$(self).removeAttr('title');}
if(0==$(self).width()){settings.width=savedwidth;settings.height=savedheight;}else{if(settings.width!='none'){settings.width=settings.autowidth?$(self).width():settings.width;}
if(settings.height!='none'){settings.height=settings.autoheight?$(self).height():settings.height;}}
if($(this).html().toLowerCase().replace(/(;|"|\/)/g,'')==settings.placeholder.toLowerCase().replace(/(;|"|\/)/g,'')){$(this).html('');}
self.editing=true;self.revert=$(self).html();$(self).html('');var form=$('<form />');if(settings.cssclass){if('inherit'==settings.cssclass){form.attr('class',$(self).attr('class'));}else{form.attr('class',settings.cssclass);}}
if(settings.style){if('inherit'==settings.style){form.attr('style',$(self).attr('style'));form.css('display',$(self).css('display'));}else{form.attr('style',settings.style);}}
var input=element.apply(form,[settings,self]);var input_content;if(settings.loadurl){var t=setTimeout(function(){input.disabled=true;content.apply(form,[settings.loadtext,settings,self]);},100);var loaddata={};loaddata[settings.id]=self.id;if($.isFunction(settings.loaddata)){$.extend(loaddata,settings.loaddata.apply(self,[self.revert,settings]));}else{$.extend(loaddata,settings.loaddata);}
$.ajax({type:settings.loadtype,url:settings.loadurl,data:loaddata,async:false,success:function(result){window.clearTimeout(t);input_content=result;input.disabled=false;}});}else if(settings.data){input_content=settings.data;if($.isFunction(settings.data)){input_content=settings.data.apply(self,[self.revert,settings]);}}else{input_content=self.revert;}
content.apply(form,[input_content,settings,self]);input.attr('name',settings.name);buttons.apply(form,[settings,self]);$(self).append(form);plugin.apply(form,[settings,self]);$(':input:visible:enabled:first',form).focus();if(settings.select){input.select();}
input.keydown(function(e){if(e.keyCode==27){e.preventDefault();reset.apply(form,[settings,self]);}});var t;if('cancel'==settings.onblur){input.blur(function(e){t=setTimeout(function(){reset.apply(form,[settings,self]);},500);});}else if('submit'==settings.onblur){input.blur(function(e){t=setTimeout(function(){form.submit();},200);});}else if($.isFunction(settings.onblur)){input.blur(function(e){settings.onblur.apply(self,[input.val(),settings]);});}else{input.blur(function(e){});}
form.submit(function(e){if(t){clearTimeout(t);}
e.preventDefault();if(false!==onsubmit.apply(form,[settings,self])){if(false!==submit.apply(form,[settings,self])){if($.isFunction(settings.target)){var str=settings.target.apply(self,[input.val(),settings]);$(self).html(str);self.editing=false;callback.apply(self,[self.innerHTML,settings]);if(!$.trim($(self).html())){$(self).html(settings.placeholder);}}else{var submitdata={};submitdata[settings.name]=input.val();submitdata[settings.id]=self.id;if($.isFunction(settings.submitdata)){$.extend(submitdata,settings.submitdata.apply(self,[self.revert,settings]));}else{$.extend(submitdata,settings.submitdata);}
if('PUT'==settings.method){submitdata['_method']='put';}
$(self).html(settings.indicator);var ajaxoptions={type:'POST',data:submitdata,dataType:'html',url:settings.target,success:function(result,status){if(ajaxoptions.dataType=='html'){$(self).html(result);}
self.editing=false;callback.apply(self,[result,settings]);if(!$.trim($(self).html())){$(self).html(settings.placeholder);}},error:function(xhr,status,error){onerror.apply(form,[settings,self,xhr]);}};$.extend(ajaxoptions,settings.ajaxoptions);$.ajax(ajaxoptions);}}}
$(self).attr('title',settings.tooltip);return false;});});this.reset=function(form){if(this.editing){if(false!==onreset.apply(form,[settings,self])){$(self).html(self.revert);self.editing=false;if(!$.trim($(self).html())){$(self).html(settings.placeholder);}
if(settings.tooltip){$(self).attr('title',settings.tooltip);}}}};});};$.editable={types:{defaults:{element:function(settings,original){var input=$('<input type="hidden"></input>');$(this).append(input);return(input);},content:function(string,settings,original){$(':input:first',this).val(string);},reset:function(settings,original){original.reset(this);},buttons:function(settings,original){var form=this;if(settings.submit){if(settings.submit.match(/>$/)){var submit=$(settings.submit).click(function(){if(submit.attr("type")!="submit"){form.submit();}});}else{var submit=$('<button type="submit" />');submit.html(settings.submit);}
$(this).append(submit);}
if(settings.cancel){if(settings.cancel.match(/>$/)){var cancel=$(settings.cancel);}else{var cancel=$('<button type="cancel" />');cancel.html(settings.cancel);}
$(this).append(cancel);$(cancel).click(function(event){if($.isFunction($.editable.types[settings.type].reset)){var reset=$.editable.types[settings.type].reset;}else{var reset=$.editable.types['defaults'].reset;}
reset.apply(form,[settings,original]);return false;});}}},text:{element:function(settings,original){var input=$('<input />');if(settings.width!='none'){input.width(settings.width);}
if(settings.height!='none'){input.height(settings.height);}
input.attr('autocomplete','off');$(this).append(input);return(input);}},textarea:{element:function(settings,original){var textarea=$('<textarea />');if(settings.rows){textarea.attr('rows',settings.rows);}else if(settings.height!="none"){textarea.height(settings.height);}
if(settings.cols){textarea.attr('cols',settings.cols);}else if(settings.width!="none"){textarea.width(settings.width);}
$(this).append(textarea);return(textarea);}},select:{element:function(settings,original){var select=$('<select />');$(this).append(select);return(select);},content:function(data,settings,original){if(String==data.constructor){eval('var json = '+data);}else{var json=data;}
for(var key in json){if(!json.hasOwnProperty(key)){continue;}
if('selected'==key){continue;}
var option=$('<option />').val(key).append(json[key]);$('select',this).append(option);}
$('select',this).children().each(function(){if($(this).val()==json['selected']||$(this).text()==$.trim(original.revert)){$(this).attr('selected','selected');}});if(!settings.submit){var form=this;$('select',this).change(function(){form.submit();});}}}},addInputType:function(name,input){$.editable.types[name]=input;}};$.fn.editable.defaults={name:'value',id:'id',type:'text',width:'auto',height:'auto',event:'click.editable',onblur:'cancel',loadtype:'GET',loadtext:'Loading...',placeholder:'Click to edit',loaddata:{},submitdata:{},ajaxoptions:{}};})(jQuery);$(document).ready(function(){window.updateMilestones=function(i,milestone){$('#milestone_'+milestone.id).replaceWith(milestone.html);};$.fn.hoverClass=function(className){var toggleClassName=function(){$(this).toggleClass(className);};return $(this).hover(toggleClassName,toggleClassName);};$.extractID=function(id){return parseInt(id.match(/\d+/)[0]);};$.fn.extractID=function(){return $.extractID($(this).attr('id'));};$.fn.linkTarget=function(){var matchInfo=$(this).attr('href').match(/(#.*)$/);if(matchInfo){var anchor=matchInfo[1];return $(anchor);}else{return nil;}};$('#main > ul.project[id]').sortable({axis:'y',cursor:'ns-resize',cursorAt:'top',opacity:0.8,items:'li.milestone, li.feature:not(#feature_new)',scroll:true,handle:'li.top',update:function(event,ui){var list=$(this);var ids=$.map(list.sortable('toArray'),$.extractID);var project_id=list.extractID();var folder_id=$('h1.folder').extractID();$.post("/projects/"+project_id+"/folders/"+folder_id+"/reorder",$.param({"project_items[]":ids}),function(json){$.each(json,updateMilestones);},'json');}});$('#main li.feature .move_to_page').livequery(function(){$(this).draggable({revert:'invalid'});});$('#sidebar ul.pages li:not(.selected)').droppable({accept:'.move_to_page',hoverClass:'drophover',tolerance:'pointer',drop:function(event,ui){var $handle=ui.draggable;var $feature=$handle.parents('li.feature');var $sortable=$feature.parents('.ui-sortable');var $this=$(this);var offsetTop=$this.offset().top-$feature.offset().top;var offsetLeft=$this.offset().left-$feature.offset().left;$handle.hide();var animateAndUpdate=function(json){$feature.css({position:'relative'}).animate({opacity:0.0,fontSize:0,height:$this.height()+'px',width:$this.width()+'px',top:offsetTop+'px',left:offsetLeft+'px'},750,function(){$feature.remove();$sortable.sortable('refresh');});$.each(json,updateMilestones);};$.status.show("Moving feature...");$.post($this.find('a').attr('href')+'/accept',$.param({'feature_id':$feature.extractID()}),animateAndUpdate,'json');}});$('.edit_feature ol, .edit_scenario ol').livequery(function(){$(this).sortable({start:function(event,ui){var selector=$(ui).sortable('options','items');$(ui).find(selector).data('sorting',true);},stop:function(event,ui){var selector=$(ui).sortable('options','items');$(ui).find(selector).data('sorting',false);},axis:'y',cursor:'ns-resize',cursorAt:'left',items:'li[id]',forceHelperSize:true,forcePlaceHolderSize:true,tolerance:'intersect',handle:'.handle img',scroll:true,opacity:0.8});});$('form.new_feature ul.items, form.edit_feature ul.items').livequery(function(){$(this).sortable({start:function(event,ui){var selector=$(ui).sortable('options','items');$(ui).find(selector).data('sorting',true);},stop:function(event,ui){var selector=$(ui).sortable('options','items');$(ui).find(selector).data('sorting',false);},axis:'y',cursor:'ns-resize',cursorAt:'left',items:'li.edit_scenario',scroll:true,tolerance:'intersect',opacity:0.8,handle:'li:first .handle img',delay:200});});$('li.edit_feature li[id], li.edit_scenario li:not(.add)').livequery(function(){$(this).mouseover(function(){clearTimeout($(this).data('hoverTimeout'));$(this).find('.handle').show();}).mouseout(function(){if(!$(this).data('sorting')){var th=$(this);$(this).data('hoverTimeout',setTimeout(function(){th.find('.handle').hide();},200));}});});$('.feature form a[rel=remove]').livequery('click',function(){if($(this).linkTarget()&&($(this).parents('li.add').length==0||confirm($(this).attr('title')+"?")))
$($(this).attr('href')).remove();return false;});window.valuePropTemplate=$.template('\
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
      </li>',{compile:true});$('li.edit_feature li.add a').livequery('click',function(){var addLi=$(this).parents('li.add')
var stepSiblings=addLi.siblings('*[id]');var feature=stepSiblings.extractID();var index=0;$.each(stepSiblings,function(i,elem){id=parseInt($(elem).attr('id').match(/\d+$/)[0]);if(id>=index)
index=id;});index+=1;addLi.before(window.valuePropTemplate.apply({feature:feature,index:index}));return false;});window.scenarioStepTemplate=$.template('\
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
    </li>',{compile:true});$('li.edit_scenario a[rel=add]').livequery('click',function(){var scenario=$(this).parents('.edit_scenario');var featureID=scenario.extractID();var scenarioID=scenario.attr('id').match(/\d+$/)[0];var stepSiblings=$(this).parents('li.add').siblings('li[id]');var index=0;$.each(stepSiblings,function(i,elem){id=parseInt($(elem).attr('id').match(/\d+$/)[0]);if(id>=index)
index=id;});index+=1;$(this).parents('li.add').before(window.scenarioStepTemplate.apply({'feature':featureID,'scenario':scenarioID,'index':index}));return false;});window.scenarioTemplate=$.template('\
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
    </li>',{compile:true});$('.feature form a.new_scenario').livequery('click',function(){var feature=$(this).parents('.feature').attr('id').match(/(new|\d+)$/)[1];var scenarios=$(this).parents('li.footer').siblings('li[id]');var scenario=0;$.each(scenarios,function(i,elem){id=parseInt($(elem).attr('id').match(/\d+$/)[0]);if(id>=scenario)
scenario=id;});scenario+=1;var scenarioElem=$(window.scenarioTemplate.apply({'feature':feature,'scenario':scenario}));$(this).parents('li.footer').before(scenarioElem);var addLi=scenarioElem.find('li.add');addLi.before(window.scenarioStepTemplate.apply({'feature':feature,'scenario':scenario,'index':1}));addLi.before(window.scenarioStepTemplate.apply({'feature':feature,'scenario':scenario,'index':2}));addLi.before(window.scenarioStepTemplate.apply({'feature':feature,'scenario':scenario,'index':3}));$('select:nth(1)',scenarioElem).val('When');$('select:nth(2)',scenarioElem).val('Then');return false;});$('li.edit_feature input:first').livequery('keyup',function(){var title=$(this).parents('.drawer').siblings('.top').find('.value')
title.html($.trim($(this).val()));return true;});$('.milestone a.delete_milestone, .feature a.delete_feature, a.delete_project').livequery('click',function(){if(confirm($(this).attr('title')+"?")){$.status.show("Deleting...");$.post($(this).attr('href'),{'_method':'delete','format':'js'},function(content){},'script');}
return false;});$('form.new_feature, form.edit_feature').livequery('submit',function(){var old_element=$(this).parents('.feature');$.status.show("Saving...");$.ajax({url:$(this).attr('action'),data:$(this).serializeArray(),type:'POST',error:function(xhr,status,error){alert("Your feature could not be saved. Please check the form and try again.\n"+(error||status));$.status.hide();},success:function(content){var new_element=$(content);old_element.replaceWith(new_element);$.status.hide();},dataType:'html'});return false;});$('form.new_feature button[name], form.edit_feature button[name]').livequery('click',function(event){event.preventDefault();$(this).parents('form').find('input[name='+$(this).attr('name')+']').val($(this).attr('value'));$(this).parents('form').submit();});$('form.new_feature a.cancel, form.edit_feature a.cancel').livequery('click',function(){var form=$(this).parents(form);if(form.hasClass('new_feature')){var feature=form.parents('.feature');$.status.show("Deleting...");$.scrollUpBy(feature.height(),function(){$.status.hide();feature.fadeOut(500,function(){$(this).remove();});});}else{$.status.show("Canceling edits...");$(this).parents('.drawer').toggle('blind');$.get($(this).attr('href'),{},function(content){var dom=$(content);if(dom){form.parents('.feature').replaceWith(dom);dom.scrollTo();}},'html');}
return false;});$('h1.folder').each(function(){var $this=$(this);var url=$this.attr('data-url');var token=$this.attr('data-token');$this.editable(url,{name:'folder[name]',type:'text',cancel:null,submit:null,select:true,onblur:'cancel',submitdata:$.param({authenticity_token:token}),method:'PUT',width:'inherit',height:'18px',ajaxoptions:{dataType:'json'},callback:function(result,settings){$(this).html(result.name);$('li#folder_'+result.id).find('a').html(result.name);},onsubmit:function(){$.status.show("Saving...");}});});$('.feature a.edit_feature').livequery('click',function(){$.status.show("Loading...");$(this).parents('.feature').find('.middle a.edit_feature').hide();var drawer=$(this).parents('.feature').find('.drawer');$.get($(this).attr('href'),{},function(content){var dom=$(content);if(dom){drawer.replaceWith(dom);dom.scrollTo(function(){dom.find('li.edit_feature input:first').focus().select();});}},'html');return false;});$('.feature .buttons a[rel=toggle]').livequery('click',function(){if(!$(this).is('.feature#feature_new a')){var feature=$(this).parents('.feature');var drawer=feature.find('.drawer');if(drawer.is(':hidden')&&drawer.find('form').size()==0)
$(this).parents('.feature').find('a.edit_feature, a.delete_feature').show();else
$(this).parents('.feature').find('a.edit_feature, a.delete_feature').hide();drawer.toggle('blind');feature.find('a[rel=toggle] span.toggle').toggle();}
return false;});$('li.toggle label').livequery('click',function(){$(this).parent().siblings('li').toggle();});$('a#new_feature, a#new_milestone').click(function(){$.status.show("Loading...");var method=$(this).is("#new_milestone")?$.post:$.get;method($(this).attr('href'),{},function(content){var dom=$(content);if(dom){$('#main > ul').append(dom);dom.scrollTo(function(){dom.find('li.edit_feature input:first').focus().select();});}},'html');return false;});$('#login_toggle a.toggle').click(function(){$('a.toggle').not($(this)).each(function(){$(this).show().linkTarget().hide();});$(this).hide().linkTarget().show();return false;});$('#open_id #providers a').click(function(){var href=$(this).attr('href');if(href.match("username")){$("li#openid_username").show();$("li#openid_username input#openid_username").focus();$("#user_openid_identifier, #user_session_openid_identifier").val(href);}else{$("li#openid_username").hide();$("#user_openid_identifier, #user_session_openid_identifier").val(href);}
return false;});$("input#openid_username").keypress(function(e){if(e.which==13){$('#openid-login div.buttons button, #openid-signup div.buttons button').click();}});$('#openid-login div.buttons button, #openid-signup div.buttons button').click(function(){var merge_username=$("li#openid_username").is(":visible");if(merge_username){var href=$("#user_session_openid_identifier, #user_openid_identifier").val();var username=$("input#openid_username").val();$("#user_session_openid_identifier, #user_openid_identifier").val(href.replace("username",username));$("li#openid_username").hide();}});$('form#add_members_form input[name=email]').autocomplete({url:'/users/by_email',template:'<li><span class="value">${email}</span> (${name})</li>',itemsKey:'users',param:'email'});$('select#project_id').change(function(){if($.trim($(this).attr('value')).length!=0)
window.location.href='/projects/'+$(this).attr('value');});$('button#update_project').click(function(){$('form.edit_project').submit();});$('.limit').keypress(function(){var max=$(this).attr('size')-1;if($(this).val().length>max){$(this).val($(this).val().substring(0,max));}});});