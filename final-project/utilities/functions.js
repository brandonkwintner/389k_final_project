var MALE_WEIGHT_CLASSES = [59, 66, 74, 83, 93, 105, 120];
var FEMALE_WEIGHT_CLASSES = [47, 52, 57, 63, 72, 84]

function determine_gender(gender) {
    /**
     * @param gender: (String) Person's gender.
     * @returns True if the person is a male, false otherwise.
     */
    formatted_str = gender.toLowerCase()
    return formatted_str === "male" ? true : false
}

function determine_gender_by_weight_class(weight_class) {
    /**
     * @param weight_class: (Number) Weight class.
     * @returns True if the weight class is a Male weight class, false otherwise.
     */
    return MALE_WEIGHT_CLASSES.includes(weight_class) ? true : false
}

function determine_weight_class(weight_in, is_male) {
    /**
     * @param weight_in: (Number) Person's weight.
     * @param is_male: (Boolean) True if the person is a male, false otherwise.
     * @returns an array containing: [weight class: Number, plus: Boolean]
     */
    const weight = parseInt(weight_in)
    var idx = 0
    if(is_male) {
        while(idx < MALE_WEIGHT_CLASSES.length) {
            if(weight < MALE_WEIGHT_CLASSES[idx]) {
                return [MALE_WEIGHT_CLASSES[idx], false]
            }
            idx++;
        }
        return [120, true]
    }
    else {
        while(idx < FEMALE_WEIGHT_CLASSES.length) {
            if(weight < FEMALE_WEIGHT_CLASSES[idx]) {
                return [FEMALE_WEIGHT_CLASSES[idx], false]
            }
            idx++;
        }
        return [84, true]
    }
}

function is_valid_weight_class(weight) {
    /**
     * @param weight: (Number) Weight class.
     * @returns True if the weight class is valid, false otherwise.
     */
    return MALE_WEIGHT_CLASSES.includes(weight) || FEMALE_WEIGHT_CLASSES.includes(weight)
}

module.exports = {
    determine_gender: determine_gender,
    determine_gender_by_weight_class: determine_gender_by_weight_class,
    determine_weight_class: determine_weight_class,
    is_valid_weight_class: is_valid_weight_class
}