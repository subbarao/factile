
var questionCount = 0;
var currentPage = 'p1';

function openPage(id) {
  $('#' + currentPage).hide();
  $('#' + id).show();
  $('#tab_' + currentPage).attr('class', '');
  $('#tab_' + id).attr('class', 'active');
  currentPage = id;
  $("#piping").hide();
}

function initQuestion() {
  questionCount = questionCount + 1;
  return "q" + padTo4Characters(questionCount + "");
}

function padTo4Characters(s) {
  var n = "";
  for (i = 0; i< (4 - s.length); i++) {
    n = "0" + n;
  }

  n += s;

  return n;
}

function addNode(html, qId) {
  var div = document.createElement('div'); 
  html = "<div class=\"pull-right\">" + 
       "<a href=\"#\" onclick=\"getQuestionsForMove(this);\"><i class=\"icon-move icon-padding\" title=\"Move\"></i></a>" + 
       "<a href=\"#\" class=\"copyQuestion\" onclick=\"copyQuestion();\"><i class=\"icon-book icon-padding\" title=\"Copy\"></i></a>" + 
       "<a href=\"#\" onclick=\"removeQuestion(this);\"><i class=\"icon-trash icon-padding\" title=\"Delete\"></i></a></div>" + 
       "<div class=\"control-group\">" + 
       html + "</div></div>";
  div.className = "block";
  div.innerHTML = html;
  document.getElementById(currentPage).appendChild(div);
  setTimeout("document.getElementById('" + qId + '_q' + "').focus()", 10);
  $(".copyQuestion").live().each(function() {
    $(this).unbind('click');
    $(this).click(copyQuestion);
  });
}

function addPage() {
  var pageNum = prompt("Please enter the page number after which this page would be inserted.")
  if (!pageNum) return false;
  
  if (pageNum < 1 || pageNum > $("#page_nav_tabs li").length) {
    alert("The page number should be between 1 and " + $("#page_nav_tabs li").length);
    return false;
  }

  var qId = initQuestion();
  var html = "";
  html += "<div class=\"pull-right\"><a href=\"#\" onclick=\"removePage(this);\" class=\"btn btn-danger\"><i class=\"icon-trash icon-white\" title=\"Delete\"></i></a></div>";
  html += "<div class=\"clearfix\">&nbsp;</div>";
  html += "<div class=\"clearfix\">&nbsp;</div>";
  html += "<input type='hidden' name='question[]' id='" + qId + "' value='" + qId + "'/>";
  html += "<input type='hidden' name='" + qId + "_q' id='" + qId + "_q' value='page'/>";
  html += "<input type='hidden' name='" + qId + "_t' id='" + qId + "_t' value='page'/>";

  var div = document.createElement('div'); 
  div.id = qId;
  div.class = "page";
  div.innerHTML = html;

  $(".page").each(function(i, p){
    if (i+1 == pageNum) {
      $(div).insertAfter(p);
    }
  });

  var tab = document.createElement('li'); 
  tab.id = "tab_" + qId;
  pageCount += 1;
  tab.innerHTML = "<a href=\"#\" onclick=\"openPage('" + qId + "')\">Page " + pageCount + "</a>";

  $("#page_nav_tabs li").each(function(i, p){
    if (i+1 == pageNum) {
      $(tab).insertAfter(p);
    }
  });

  reNumberPages();
  openPage(qId);
}

function reNumberPages() {
  $("#page_nav_tabs li a").each(function(index, obj){
    $(obj).html("Page " + (index + 1));
  });
}

function qText(qId, qTypeName, qType, plain) {
  var html = qTypeName;
  html += " <input type='hidden' name='question[]' id='" + qId + "' value='" + qId + "'/>";
  html += "<input type='hidden' name='" + qId + "_t' id='" + qId + "_t' value='" + qType + "'/><br/><br/>";
  html += "<label class=\"control-label\">Text</label><div class=\"controls\">";
  if (plain) {
    html += "<textarea name='" + qId + "_q' id='" + qId + "_q' rows='5' class='input-xxlarge'></textarea>";
  } else {
    html += "<input type='text' name='" + qId + "_q' id='" + qId + "_q' class='input-xxlarge' placeholder='Please enter the question here'/>";
    html += "</div><div class=\"controls\"><label class=\"checkbox\">";
    html += "<input type='checkbox' name='" + qId + "_m' id='" + qId + "_m' value='true' />Mandatory</label>";
  }
  return html;
}

function qOptions(qId) {
  var html = "</div><br><label class=\"control-label\">";
  html += "Options</label><div class=\"controls\"><textarea name='" + qId + "_options' id='" + qId + "_options' rows='5' class='input-xxlarge'" + 
  " placeholder='Please enter the options here, each in a new line.'></textarea>";
  html += "</div><div class=\"controls\"><label class=\"checkbox\">";
  html += "<input type='checkbox' name='" + qId + "_allow_other' id='" + qId + "_allow_other' value='true' />Allow 'Other' option</label></div>";
  html += "</div><label class=\"control-label\">";
  html += "Text for 'Other' option</label><div class=\"controls\"><input type='text' name='" + qId + "_other_text' id='" + qId + "_other_text' class='input-xxlarge'/>";
  return html;
}

function qDimensions(qId) {
  var html = "</div><br><label class=\"control-label\">";
  html += "Questions</label><div class=\"controls\"><textarea name='" + qId + "_dimensions' id='" + qId + "_dimensions' rows='5' class='input-xxlarge'" + 
  " placeholder='Please enter the questions here, each in a new line.'></textarea>";
  return html;
}

function addRatingScale() {
  var qId = initQuestion();
  var html = qText(qId, "Rating Scale", "rating");
  html += qOptions(qId);
  html += qDimensions(qId);
  addNode(html, qId);
}

function addRadio() {
  var qId = initQuestion();
  var html = qText(qId, "Single Choice", "radio");
  html += qOptions(qId);
  addNode(html, qId);
}

function addCheckbox() {
  var qId = initQuestion();
  var html = qText(qId, "Multiple Choice", "checkbox");
  html += qOptions(qId);
  addNode(html, qId);
}

function addRanking() {
  var qId = initQuestion();
  var html = qText(qId, "Ranking", "ranking");
  html += qOptions(qId);
  addNode(html, qId);
}

function addTextField() {
  var qId = initQuestion();
  var html = qText(qId, "Text Field", "text");
  addNode(html, qId);
}

function addTextArea() {
  var qId = initQuestion();
  var html = qText(qId, "Large Text/ Essay", "textarea");
  addNode(html, qId);
}

function addDropdown() {
  var qId = initQuestion();
  var html = qText(qId, "Dropdown", "dropdown");
  html += qOptions(qId);
  addNode(html, qId);
}

function addInfoNode() {
  questionCount = questionCount + 1;
  var qId = initQuestion();
  var html = qText(qId, "Plain Text", "info", true);
  addNode(html, qId);

  CKEDITOR.replace( qId + "_q");
}

function removeQuestion(obj) {
  var toolsDiv = obj.parentNode;
  var questionDiv = toolsDiv.parentNode;
  var wrapper = questionDiv.parentNode;

  wrapper.removeChild(questionDiv);
}

function removePage(obj) {
  var toolsDiv = obj.parentNode;
  var page = toolsDiv.parentNode;
  var survey = page.parentNode;
  var tab = document.getElementById("tab_" + page.id);

  survey.removeChild(page);

  document.getElementById("page_nav_tabs").removeChild(tab);
  reNumberPages();

  var id = $("#page_nav_tabs").find("li:first").attr("id").replace("tab_", "");
  openPage(id);
}

function copyQuestion() {
  var qId = "";
  var qDiv = $(this).parent().parent();
  qDiv.find('input:hidden').each(function(){
    if ($(this).attr('name') == 'question[]') {
      qId = $(this).val();
    }
  });
  if (qId != "") {
    var qType = qDiv.find('input[id="' + qId + '_t"]:first').val();
    if (qType == 'text') {
      addTextField();
    } else if (qType == 'radio') {
      addRadio();
    } if (qType == 'dropdown') {
      addDropdown();
    } if (qType == 'checkbox') {
      addCheckbox();
    } if (qType == 'rating') {
      addRatingScale();
    } if (qType == 'info') {
      addInfoNode();
    } if (qType == 'textarea') {
      addTextArea();
    }
    var newQid = "q" + padTo4Characters(questionCount + "");
    var qmandatory = qDiv.find('input[id="' + qId + '_m"]:first').attr('checked');
    $('#' + newQid + '_m').attr('checked', qmandatory);
    var qText = qDiv.find('input[id="' + qId + '_q"]:first').val();
    $('#' + newQid + '_q').val(qText);

    if (qType == 'radio' || qType == 'dropdown' || qType == 'checkbox' || qType == 'rating') {
      var qOptions = $('#' + qId + '_options').val();
      $('#' + newQid + '_options').val(qOptions);
      qOptions = $('#' + qId + '_allow_other').attr('checked');
      $('#' + newQid + '_allow_other').attr('checked', qOptions);
      qOptions = $('#' + qId + '_other_text').val();
      $('#' + newQid + '_other_text').val(qOptions);
    }

    if (qType == 'rating') {
      var qDimensions = $('#' + qId + '_dimensions').val();
      $('#' + newQid + '_dimensions').val(qDimensions);
    }

  } 
}

$(document).ready(function() {
  $('.copyQuestion').each(function() {
    $(this).click(copyQuestion);
  });
});
