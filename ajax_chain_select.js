/**
 * @file
 * Javascript code for Ajax Chain Select module.
 */

(function($) {
  Drupal.behaviors.AjaxChainSelect = {
    attach: function(context, settings) {
      $("select.ajax-chain-select-select", context).change(function() {
        var current_el = this,
                parent_fieldset = $(current_el).parents('fieldset'),
                fieldset_settings = settings['ajax_chain_select'][$(parent_fieldset).attr('id')],
                current_level_id = this.value,
                url = Drupal.settings.basePath + 'ajax_chain_select/callback/',
                formitem = $(current_el).closest('.form-item'),
                next_all = formitem.nextAll(),
                next_el = $(next_all[0]),
                dc = null,
                dch = null,
                next_level = next_el.find('select').attr('level');

        for (var $i = 1; $i < next_all.length; $i++) {
          var next_ptr = $(next_all[$i]);
          if (next_ptr.hasClass('form-type-textfield')) {
            continue;
          }
          else {
            // Disabling all next select elements and setting them to their first value.
            next_ptr.addClass('form-disabled').find('select').attr('disabled', 'disabled');
            if (next_ptr.find('select').find('option') !== undefined) {
              next_ptr.find('select').find('option:eq(0)').attr('selected', 'selected');
            }
          }
        }

        dc = $(parent_fieldset).find('.form-type-textfield input.acs-dc').val();
        dch = $(parent_fieldset).find('.form-type-textfield input.acs-dch').val();

        if (current_level_id === "") {
          next_el.addClass('form-disabled').find('select').attr('disabled', 'disabled');
          if (next_el.find('select').find('option') !== undefined) {
            next_el.find('select').find('option:eq(0)').attr('selected', 'selected');
          }
        }
        else {

          $(current_el).addClass('progress-disabled').attr('disabled', true);

          if (fieldset_settings.show_throbber) {
            var progress_el = $('<div class="ajax-progress ajax-progress-throbber"><div class="throbber">&nbsp;</div></div>');
            if (fieldset_settings.progress_message) {
              $('.throbber', progress_el).after('<div class="message">' + fieldset_settings.progress_message + '</div>');
            }
            $(current_el).after(progress_el);
          }

          $.getJSON(url + next_level + '/' + current_level_id + '/' + dc + '/' + dch, function(response) {

            $(current_el).removeClass('progress-disabled').removeAttr('disabled');

            if (fieldset_settings.show_throbber) {
              $(progress_el).remove();
            }

            if (response.has_data === '1') {
              var temp = next_el.find('select').find('option:eq(0)');
              next_el.find('select').html(temp);
              next_el.find('select').append(response.options);
              next_el.removeClass('form-disabled').find('select').removeAttr('disabled');
            }
            else {
              next_el.addClass('form-disabled').find('select').attr('disabled', 'disabled');
              if (next_el.find('select').find('option') !== undefined) {
                next_el.find('select').find('option:eq(0)').attr('selected', 'selected');
              }
            }
          });
        }
      });
    }
  };

})(jQuery);
