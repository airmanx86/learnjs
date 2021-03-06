'use strict';

const learnjs = {};

learnjs.problems = [
    {
        description: 'What is truth?',
        code: 'function problem() { return __; }'
    },
    {
        description: 'Simple Math',
        code: 'function problem() { return 42 === 6 * __; }'
    }
];

learnjs.template = function(name) {
    return $('.templates .' + name).clone();
}

learnjs.applyObject = function applyObject(obj, elem) {
    for (let key in obj) {
        elem.find('[data-name="' + key + '"]').text(obj[key]);
    }
};

learnjs.flashElement = function (elem, content) {
    elem.fadeOut('fast', function () {
        elem.html(content);
        elem.fadeIn();
    });
}

learnjs.buildCorrectFlash = function (problemNum) {
    const correctFlash = learnjs.template('correct-flash');
    const link = correctFlash.find('a');

    if (problemNum < learnjs.problems.length) {
        link.attr('href', '#problem-' + (problemNum + 1));
    } else {
        link.attr('href', '');
        link.text("You're Finished!");
    }

    return correctFlash;
}
  
learnjs.problemView = function problemView(data) {
    const problemNumber = parseInt(data, 10);
    const view = learnjs.template('problem-view');
    const problemData = learnjs.problems[problemNumber - 1];
    const resultFlash = view.find('.result');

    function checkAnswer() {
        const answer = view.find('.answer').val();
        const test = problemData.code.replace('__', answer) + '; problem();';
        return eval(test);
    }

    function checkAnswerClick() {
        if (checkAnswer()) {
            const flashContent = learnjs.buildCorrectFlash(problemNumber);
            learnjs.flashElement(resultFlash, flashContent);
        } else {
            learnjs.flashElement(resultFlash, 'Incorrect!');
        }

        return false;
    }

    view.find('.check-btn').click(checkAnswerClick);
    view.find('.title').text('Problem #' + problemNumber);
    learnjs.applyObject(learnjs.problems[problemNumber - 1], view);
    return view;
};

learnjs.showView = function showView(hash) {
    const routes = {
        '#problem': learnjs.problemView,
    };

    const hashParts = hash.split('-');
    const viewFn = routes[hashParts[0]];

    if (viewFn) {
        $('.view-container').empty().append(viewFn(hashParts[1]));
    }
};

learnjs.appOnReady = function appOnReady() {
    window.onhashchange = function onhashchange() {
        learnjs.showView(window.location.hash);
    };

    learnjs.showView(window.location.hash);
};
