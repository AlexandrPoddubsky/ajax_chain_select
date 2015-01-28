//(function ($) {
//  Drupal.behaviors.AjaxChainSelect = {
//    attach: function (context) {
//      // Replace span with a link.
//      $(".ajax-chain-select-select", context).each(function() {
//        console.log(this);
//      })
//    }
//  }
//  })(jQuery);

function f3region_get_element(el, $previous_level) {
  var previous_level_id = el.value,
          url = Drupal.settings.basePath + 'ajax_chain_select/callback/',
          $formitem = jQuery(el).closest('.form-item'),
          $nextall = {},
          $nextel = null,
          $dc = null,
          $dch = null,
          $next_level = $previous_level + 1;

  $nextall = $formitem.nextAll();
  $nextel = jQuery($nextall[0]);

  for (var $i = 1; $i < $nextall.length; $i++) {
    var $next_ptr = jQuery($nextall[$i]);
    if ($next_ptr.hasClass('form-type-textfield')) {
      continue;
    } else {
      $next_ptr.addClass('form-disabled').find('select').attr('disabled', 'disabled');
      if ($next_ptr.find('select').find('option') != 'undefined') {
        $next_ptr.find('select').find('option:eq(0)').attr('selected', 'selected');
      }
    }
  }

  $dc = jQuery(el).closest('fieldset').find('.form-type-textfield input.acs-dc').val();
  $dch = jQuery(el).closest('fieldset').find('.form-type-textfield input.acs-dch').val();

  if (previous_level_id == "" || isNaN(Number(previous_level_id))) {
    $nextel.addClass('form-disabled').find('select').attr('disabled', 'disabled');
    if ($nextel.find('select').find('option') != 'undefined') {
      $nextel.find('select').find('option:eq(0)').attr('selected', 'selected');
    }
  } else {
    jQuery.getJSON(url + $next_level + '/' + previous_level_id + '/' + $dc + '/' + $dch, function(response) {
      if (response.has_data == '1') {
        var $temp = $nextel.find('select').find('option:eq(0)');
        $nextel.find('select').html($temp);
        $nextel.find('select').append(response.options);
        $nextel.removeClass('form-disabled').find('select').removeAttr('disabled');
      } else {
        $nextel.addClass('form-disabled').find('select').attr('disabled', 'disabled');
        if ($nextel.find('select').find('option') != 'undefined') {
          $nextel.find('select').find('option:eq(0)').attr('selected', 'selected');
        }
      }
    });
  }
}
