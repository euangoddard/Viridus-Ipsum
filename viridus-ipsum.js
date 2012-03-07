viridus_ipsum = {};

(function (module) {
    var DARK_GREEN_WORDS = [
        "sandels", "hemp", "tie-dye", "bong", "peace", "aid", "love",
        "Woodstock", "Greenpeace", "bra-burning",
        ];
    var LIGHT_GREEN_WORDS = [
        "carbon", "CSR", "supply chain", "waste", "water", "smart grid",
        "engagement", "sustainable", "wind turbine", "solar power",
        "ground source heat pump"];
    
    var STARTER_TEXT = "Viridus ipsum dolor sit amet ";
    
    var LOREM_IPSUM = [
        "consectetur adipiscing elit",
        "pellentesque euismod justo",
        "ut lacus pharetra rhoncus",
        "praesent nec urna eu lacus molestie egestas",
        "curabitur euismod luctus ullamcorper. Nulla facilisi",
        "etiam sagittis sagittis lorem eu pulvinar",
        "nullam nibh dui, varius vel venenatis",
        "condimentum vel lectus. Duis purus odio",
        "ullamcorper non faucibus ut",
        "bibendum elementum mauris",
        "nulla nunc neque",
        "sodales ut posuere sed",
        "molestie et enim",
        "suspendisse potenti. Donec eleifend",
        "magna a accumsan placerat",
        "est tortor fermentum elit",
        "sed malesuada odio metus at velit",
        "curabitur sit amet risus sit amet",
        "libero dignissim malesuada",
        "ut magna justo",
        "blandit id auctor vel",
        "dapibus nec augue. Nam elementum",
        "tortor sed sollicitudin viverra",
        "urna ligula posuere justo",
        "pulvinar lacus eros ut lectus"
        ];
    
    var PROBABILITY_OF_COMMA = 0.2;
    var PROBABILITY_OF_FULLSTOP = 0.1;
    var PROBABILITY_OF_NEW_PARAGRAPH = 0.02;
    var PROBABILITY_OF_IPSUM = 0.3;
    
    /**
     * Select an element at random from an array
     * @private
     * @param {Array} array The array from which to select an element
     * @returns One of the elements of array
     */
    var random_choice = function (array) {
        return array[Math.floor(Math.random() * array.length)];
    };
    
    /**
     * Generate some sustainable ipsum
     * @private
     * @param {Number} light_weight The weight to give to the light green words
     * @param {Number} word_count The number of words of ipsum to generate
     * @returns {Array} An array of paragraphs
     */
    var generate_ipsum = function (light_weight, word_count) {
        var word_index = 0;
        var is_captial_required = false;
        var is_fullstop_supressed = true;
        var group_choice;
        var group_to_use;
        var words_to_use;
        var punctuation_random_value;
        var word_end;
        var last_seen_word = null;
        var ipsum = STARTER_TEXT;
        var ipsum_paragraphs = [];
        var number_of_words;
        
        while (word_index < word_count) {
            group_choice = Math.random() * 10;
            group_to_use = (group_choice < light_weight) ? LIGHT_GREEN_WORDS : DARK_GREEN_WORDS;
            
            if (Math.random() < PROBABILITY_OF_IPSUM) {
                words_to_use = random_choice(LOREM_IPSUM);
            } else {
                words_to_use = random_choice(group_to_use);
            }
            number_of_words = words_to_use.split(" ").length + 1;
            
            // Ensure that the same word doesn't occur twice in a row
            if (last_seen_word && last_seen_word === words_to_use) {
                continue;
            }
            
            last_seen_word = words_to_use;
            
            punctuation_random_value = Math.random();
            
            if (is_captial_required) {
                words_to_use = words_to_use.substr(0, 1).toUpperCase() + words_to_use.substr(1);
                is_captial_required = false;
            }
            
            if (word_index + number_of_words >= word_count || (punctuation_random_value < PROBABILITY_OF_FULLSTOP && !is_fullstop_supressed)) {
                is_fullstop_supressed = true;
                is_captial_required = true;
                word_end = ". ";
                
            } else if (punctuation_random_value < PROBABILITY_OF_COMMA) {
                word_end = ", ";
            } else {
                word_end = " ";
            }
            
            if (punctuation_random_value < PROBABILITY_OF_NEW_PARAGRAPH) {
                ipsum = ipsum + words_to_use + ".";
                ipsum_paragraphs.push(ipsum);
                ipsum = "";
                is_fullstop_supressed = true;
                is_captial_required = true;
            } else {
                ipsum = ipsum + words_to_use + word_end;
            }
            word_index += number_of_words;
        }
        
        if (ipsum) {
            ipsum_paragraphs.push(ipsum);
        }
        
        return ipsum_paragraphs;
    };
    
    /**
     * Generate some formatted sustainable ipsum
     * @param {Number} light_weight The weight to give to the light green words
     * @param {Number} word_count The number of words of ipsum to generate
     * @returns {Array} An array of paragraphs
     */
    module.make_formatted_ipsum = function (light_weight, word_count) {
        var paragraph_contents = generate_ipsum(light_weight, word_count);
        var output = "";
        $.each(paragraph_contents, function () {
            output = output + "<p>" + this + "</p>";
        });
        
        return output;
    };
})(viridus_ipsum);


$(function () {
    var $greenicity_control = $("#greenicity");
    var $words_control = $("#words");
    var get_greenicity = function () {
        //$("body")[0].css("background-color", hslToRgb(140, 83, 50));
    };
    
    $greenicity_control.on("change", get_greenicity);
    
    get_greenicity.call($greenicity_control);
    
    $(document).on("submit", "#input-controls form", function (event_object) {
        event_object.preventDefault();
        location.hash = $(this).serialize();
    });
    
    $(window).on("hashchange", function (event_object) {
        var params = $.deparam.fragment();
        if (/^\d+$/.test(params.words) && /^[1-9]{1}$/.test(params.greenicity)) {
            
            $("#output").html(
                viridus_ipsum.make_formatted_ipsum(params.greenicity, params.words));
            
            $greenicity_control.val(params.greenicity);
            $words_control.val(params.words);
        }
    }).trigger("hashchange");
    
});