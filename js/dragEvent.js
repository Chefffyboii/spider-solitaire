function DragEvents() {
    this.el = document.getElementById('drag-el');
    this.shiftX = 0;
    this.shiftY = 0;
    this.parentOld = '';
    var that = this;

    // Start Drag
    this.startDrag = function (e) {
        var t = e.target;
        if (!cardDeck || that.el.children[0] || !dealer.checkStartDrag(t, cardDeck.selectors)) {
            return;
        }

        // Validate descending order for the dragged sequence
        if (!validateDescendingOrder(that.el.children)) {
            alert("Cards must be in descending order.");
            return false;
        }

        that.shiftX = e.pageX - t.getBoundingClientRect().left;
        that.shiftY = e.pageY - t.getBoundingClientRect().top;
        that.el.style.left = e.pageX - that.shiftX + 'px';
        that.el.style.top = e.pageY - that.shiftY + 'px';

        while (t != t.parentNode.lastElementChild) {
            that.el.insertBefore(t.parentNode.lastElementChild, that.el.children[0]);
        }

        that.parentOld = t.parentNode;
        that.el.insertBefore(t, that.el.children[0]);
        e.preventDefault();
    };

    // Move Drag
    this.moveDrag = function (e) {
        if (!that.el.children[0]) return;

        that.el.style.left = e.pageX - that.shiftX + 'px';
        that.el.style.top = e.pageY - that.shiftY + 'px';

        e.preventDefault();
    };

    // End Drag
    this.endDrag = function () {
        if (!that.el.children[0]) return;

        that.parentNew = that.getDroppable(that.el.children[0], that.parentOld);

        // Validate same-suit group movement
        if (!validateSameSuit(that.el.children)) {
            alert("Groups must be of the same suit.");
            returnCardsToOriginalPosition(that.parentOld);
            return;
        }

        while (that.el.children[0]) {
            if (that.parentNew) {
                that.parentNew.appendChild(that.el.children[0]);
            } else {
                that.parentOld.appendChild(that.el.children[0]);
            }
        }

        if (that.parentNew && that.parentOld.children[0]) {
            that.parentOld.lastElementChild.classList.add('open');
            that.parentOld.lastElementChild.classList.remove('closed');
        }

        if (that.parentNew) {
            dealer.takeAway(cardDeck.selectors, dropout, true);
            dealer.setSuitedHeight(that.parentNew, limitHeight);
            dealer.setSuitedHeight(that.parentOld, limitHeight);
        }

        if (dropout.children.length == 104) {
            dealer.showCongratulation();
            clearInterval(timeKeeper);
            UpdateScore();
            playBackgroundMusic();
        }
    };

    // Helper to get droppable container
    this.getDroppable = function (target, source) {
        if (!target) return;

        var pointX = target.getBoundingClientRect().left + target.offsetWidth / 2;
        var pointY = target.getBoundingClientRect().top - 3;

        this.container = document.elementFromPoint(pointX, pointY);

        while (this.container) {
            if (this.container.classList.contains('column')) break;
            this.container = this.container.parentElement;
        }

        if (!this.container || this.container === source) return;

        if (!this.container.children[0]) {
            noOfMoves++;
            document.getElementById("score").innerHTML = noOfMoves;
            return this.container;
        }

        var cardNum1 = +target.dataset.card.slice(1);
        var cardNum2 = +this.container.lastElementChild.dataset.card.slice(1);
        if (cardNum1 + 1 == cardNum2) {
            noOfMoves++;
            document.getElementById("score").innerHTML = noOfMoves;
            playSound('audio/pop.mp3');
            return this.container;
        }
        playSound('audio/drag.mp3');
    };

    // Helper Functions
    function validateDescendingOrder(cards) {
        let draggedCards = Array.from(cards);
        for (let i = 0; i < draggedCards.length - 1; i++) {
            let currentCard = +draggedCards[i].dataset.card.slice(1);
            let nextCard = +draggedCards[i + 1].dataset.card.slice(1);
            if (currentCard !== nextCard + 1) return false;
        }
        return true;
    }

    function validateSameSuit(cards) {
        let draggedCards = Array.from(cards);
        for (let i = 0; i < draggedCards.length - 1; i++) {
            let currentSuit = draggedCards[i].dataset.card[0];
            let nextSuit = draggedCards[i + 1].dataset.card[0];
            if (currentSuit !== nextSuit) return false;
        }
        return true;
    }

    function returnCardsToOriginalPosition(parent) {
        while (that.el.children[0]) {
            parent.appendChild(that.el.children[0]);
        }
    }

    function playSound(src) {
        let sound = new Sound(src);
        sound.play();
    }

    function playBackgroundMusic() {
        let bgSound = new Audio('audio/bg-music.mp3');
        bgSound.addEventListener('ended', function () {
            this.currentTime = 0;
            this.play();
        }, false);
        bgSound.play();
    }
}
