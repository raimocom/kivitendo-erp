// NOTE NOTE NOTE NOTE NOTE NOTE NOTE NOTE NOTE:

// Generate the dispatching lines in this script by running
// "scripts/generate_client_js_actions.pl". See the documentation for
// SL/ClientJS.pm for instructions.

function eval_json_result(data) {
  if (!data)
    return;

  if ((data.js || '') != '')
    eval(data.js);

  if (data.eval_actions)
    $(data.eval_actions).each(function(idx, action) {
      // console.log("ACTION " + action[0] + " ON " + action[1]);

      // Basic effects
           if (action[0] == 'hide')         $(action[1]).hide();
      else if (action[0] == 'show')         $(action[1]).show();
      else if (action[0] == 'toggle')       $(action[1]).toggle();

      // DOM insertion, around
      else if (action[0] == 'unwrap')       $(action[1]).unwrap();
      else if (action[0] == 'wrap')         $(action[1]).wrap(action[2]);
      else if (action[0] == 'wrapAll')      $(action[1]).wrapAll(action[2]);
      else if (action[0] == 'wrapInner')    $(action[1]).wrapInner(action[2]);

      // DOM insertion, inside
      else if (action[0] == 'append')       $(action[1]).append(action[2]);
      else if (action[0] == 'appendTo')     $(action[1]).appendTo(action[2]);
      else if (action[0] == 'html')         $(action[1]).html(action[2]);
      else if (action[0] == 'prepend')      $(action[1]).prepend(action[2]);
      else if (action[0] == 'prependTo')    $(action[1]).prependTo(action[2]);
      else if (action[0] == 'text')         $(action[1]).text(action[2]);

      // DOM insertion, outside
      else if (action[0] == 'after')        $(action[1]).after(action[2]);
      else if (action[0] == 'before')       $(action[1]).before(action[2]);
      else if (action[0] == 'insertAfter')  $(action[1]).insertAfter(action[2]);
      else if (action[0] == 'insertBefore') $(action[1]).insertBefore(action[2]);

      // DOM removal
      else if (action[0] == 'empty')        $(action[1]).empty();
      else if (action[0] == 'remove')       $(action[1]).remove();

      // DOM replacement
      else if (action[0] == 'replaceAll')   $(action[1]).replaceAll(action[2]);
      else if (action[0] == 'replaceWith')  $(action[1]).replaceWith(action[2]);

      // General attributes
      else if (action[0] == 'attr')         $(action[1]).attr(action[2], action[3]);
      else if (action[0] == 'prop')         $(action[1]).prop(action[2], action[3]);
      else if (action[0] == 'removeAttr')   $(action[1]).removeAttr(action[2]);
      else if (action[0] == 'removeProp')   $(action[1]).removeProp(action[2]);
      else if (action[0] == 'val')          $(action[1]).val(action[2]);

      // Data storage
      else if (action[0] == 'data')         $(action[1]).data(action[2], action[3]);
      else if (action[0] == 'removeData')   $(action[1]).removeData(action[2]);

      else                                  console.log("Unknown action: " + action[0]);
    });

  console.log("current_content_type " + $('#current_content_type').val() + ' ID ' + $('#current_content_id').val());
}