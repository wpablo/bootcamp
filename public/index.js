$(function () {
  $('#save').click(function(){
    if ($(this).hasClass('disabled')) return;
    var content = $('#editor').val();
    $.ajax({
      url:         '/doc/' + window.docId,
      type:        'PATCH',
      contentType: 'application/json',
      data: JSON.stringify({
        content: content
      })
    }).done(function () {
      $('#save').addClass('disabled');
    });
  });

  $('#editor').bind('input propertychange', function(){
    $('#save').removeClass('disabled');
  });

  $('.doc-title').editable(function (value) {
    
    $.ajax({
      url:         '/doc/' + window.docId,
      type:        'PATCH',
      contentType: 'application/json',
      data: JSON.stringify({title: value})
    });

    return value;
  });
});