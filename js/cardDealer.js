function CardDealer() {
    var that = this;

    this.shuffle = function(allCardsArr) {
        var i = allCardsArr.length;
        var j, t;
        while (i) {
            j = Math.floor((i--) * Math.random());
            t = allCardsArr[i];
            allCardsArr[i] = allCardsArr[j];
            allCardsArr[j] = t;
        }
    };

    this.reUpload = function(allCardsArr) {
        var ul = document.createElement('ul');
        for (var i = 0; i < allCardsArr.length; i++) {
            var li = document.createElement('li');
            li.className = 'card closed';
            li.classList.add(allCardsArr[i]);
            li.dataset.card = allCardsArr[i];
            ul.appendChild(li);
        }
        cardDeckEl.innerHTML = ul.innerHTML;
        ul = null;
    };

    this.delivery = function(n, opened, animation) {
        var cols = document.querySelectorAll('.column'); // Get all 15 columns
        var c = 0;

        for (var i = 0; i < n; i++) {
            if (opened) {
                cardDeckEl.lastElementChild.classList.add('open');
                cardDeckEl.lastElementChild.classList.remove('closed');
            }

            animation
                ? cols[c].animationAppendChild(cardDeckEl.lastElementChild)
                : cols[c].appendChild(cardDeckEl.lastElementChild);

            // Distribute cards across all 15 columns
            if (++c >= cols.length) {
                c = 0;
            }
        }
    };

    this.checkCompletedSequence = function(column) {
        var cards = column.querySelectorAll('.card.open');
        var isComplete = true;

        // Check if the column has a complete sequence from King to Ace
        for (var i = 0; i < cards.length - 1; i++) {
            if (
                cards[i].getRank() - 1 !== cards[i + 1].getRank() ||
                cards[i].getSuit() !== cards[i + 1].getSuit()
            ) {
                isComplete = false;
                break;
            }
        }

        if (isComplete) {
            this.moveToFoundation(cards);
        }
    };

    this.moveToFoundation = function(cards) {
        var foundation = document.querySelector('.foundation .foundation-pile:empty');
        if (foundation) {
            cards.forEach((card) => {
                foundation.appendChild(card);
            });
        }
    };

    // Ensure all methods and blocks are properly closed
}
