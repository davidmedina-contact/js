/**
 * @author JD Medina - (jdmedina.com)
 * @date 01/12/2011
 * @name sorter
 * @class This method extends the jQuery functionality and sorts child elements based on their text contents.
 * @example jQuery("ul.myList").sorter();
 * @return {jQuery object}
 * @options ['','desc'] - If blank: A-Z sort. If 'desc': Z-A sort.
 * @markup <select><option val="10">Chris</option><option val="17">Amy</option><option val="33">Jesus</option></select>
 * @version 1.0
 */

$.fn.extend({
	sorter: function(dir) {
		return this.each(function() {
			
			dir = (dir === "desc") ? -1 : 1;
			
			var sorted = $(this).children().sort(function(a,b) {
				// Find the list items and sort them
				return $(a).text().toLowerCase() > $(b).text().toLowerCase() ? dir : -dir;
			}); 
			
			$(this).append(sorted);
		});
	} 
});