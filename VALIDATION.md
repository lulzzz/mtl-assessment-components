# Response validation use cases

## Single answer

```html
<text-input>

    <response-validation slot="feedback" expected="smile" score="4" strategy="fuzzyMatch">
        <span>Good</span>
        <span>Wooot!</span>
    </response-validation>

    <response-validation slot="feedback" expected="grin" score="1" feedbackType="neutral" strategy="exactMatch">
        <span>Almost</span>
    </response-validation>

    <response-validation slot="feedback" score="0" feedback="negative" strategy="exactMatch">
        <span>Try again</span>
        <span>Oups, still not good</span>
        <span>Too bad!</span>
    </response-validation>

</text-input>
```

Match the `response-validation` items with the student answer in order. Examples:
* student answer: `smile`: matches the first `response-validation` block.
* student answer: `grin`: matches the second `response-validation` block.
* student answer: `australopitecus`: matches the third `response-validation` block.

When a match is found, feedback message is provided based on student attempt. Examples:
* student answer `hello` will result in: *Try again* on the first attempt, and *Oups, still not good* on the second attempt, and *Too bad!* on all subsequent attempts.


## Multiple answers

Let's say we have an MCQ multiple answers, with a score of 10 for the correct answer.

*Identify all cities the are in North America:*

1. Paris
2. Montreal
3. Buenos Aires
4. Los Angeles
5. Beijing

The correct answer is (2) and (4).

We have different ways to approach response validation:
1. _Partially correct_. If the student select one correct answer out of two, we give half the points, i.e. 5.

```html
<multiple-choice multiple>
    <div slot="option" id="1">Paris</div>
    <div slot="option" id="2">Montreal</div>
    <div slot="option" id="3">Buenos Aires</div>
    <div slot="option" id="4">Los Angeles</div>
    <div slot="option" id="5">Beijing</div>

    <response-validation slot="feedback" expected="2" score="5">
        <span>Good</span>
    </response-validation>

    <response-validation slot="feedback" expected="4" score="5">
        <span>Good</span>
    </response-validation>

    <response-validation slot="feedback" score="0">
        <span>Try again</span>
        <span>You got it wrong</span>
    </response-validation>

</multiple-choice>
```

2. _All or nothing_. Unless the student selected both answers, we give the student 0.

```html
<multiple-choice multiple>
    <div slot="option" id="1">Paris</div>
    <div slot="option" id="2">Montreal</div>
    <div slot="option" id="3">Buenos Aires</div>
    <div slot="option" id="4">Los Angeles</div>
    <div slot="option" id="5">Beijing</div>

    <response-validation slot="feedback" expected="2|4" score="10">
        <span>Good</span>
    </response-validation>

    <response-validation slot="feedback" score="0">
        <span>Try again</span>
        <span>You got it wrong</span>
    </response-validation>

</multiple-choice>
```

3. _Subtract points for wrong answers_. We may want to assign a score for each answer, and perform the total.

```html
<multiple-choice multiple>
    <div slot="option" id="1">Paris</div>
    <div slot="option" id="2">Montreal</div>
    <div slot="option" id="3">Buenos Aires</div>
    <div slot="option" id="4">Los Angeles</div>
    <div slot="option" id="5">Beijing</div>

    <response-validation slot="feedback" expected="1" score="-2">
        <span>Bad</span>
    </response-validation>

    <response-validation slot="feedback" expected="2" score="5">
        <span>Good</span>
    </response-validation>

    <response-validation slot="feedback" expected="3" score="-2">
        <span>Bad</span>
    </response-validation>

    <response-validation slot="feedback" expected="4" score="5">
        <span>Good</span>
    </response-validation>

    <response-validation slot="feedback" expected="5" score="-2">
        <span>Bad</span>
    </response-validation>

</multiple-choice>
```

In the above example, a student that checked (2), (3) and (4) would get `5 - 2 + 5 = 8 pts`.

