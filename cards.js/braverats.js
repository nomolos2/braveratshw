
//Tell the library which element to use for the table
cards.init({table:'#card-table', type:STANDARD});
initMove=60;
let pointsWorth = [1,1];
let scores = [0,0];
let compShow = document.getElementById('comp');	
let youShow = document.getElementById('you');	
let abilities = {musician,princess,spy,assassin,ambassador,wizard,general,prince};
youShow.innerHTML="You: "+ scores[0];

compShow.innerHTML="Computer: "+scores[1];

//Create a new deck of cards
deck = new cards.Deck();
//By default it's in the middle of the container, put it slightly to the side
deck.x -= 50;
score = 0;
//cards.all contains all cards, put them all in the deck
deck.addCards(cards.all);
//No animation here, just get the deck onto the table.
deck.render({immediate:true});

//Now lets create a couple of hands, one face down, one face up.
upperhand = new cards.Hand({faceUp:false, y:60});
lowerhand = new cards.Hand({faceUp:true,  y:340});

//Lets add a discard pile
discardPile = new cards.Deck({faceUp:true});
discardPile.x += 50;


//Let's deal when the Deal button is pressed:
$('#deal').click(function() {
	//Deck has a built in method to deal to hands.
	$('#deal').hide();
	deck.deal(8, [upperhand, lowerhand], 50, function() {
		//This is a callback function, called when the dealing
		//is done.
		discardPile.addCard(deck.topCard());
		discardPile.render();
	});
});


//When you click on the top card of a deck, a card is added
//to your hand
deck.click(function(card){
	if (card === deck.topCard()) {
		lowerhand.addCard(deck.topCard());
		lowerhand.render();
	}
});
function chooseWinner (rank1,rank2){
	ranks = runSpecialAbilties(rank1,rank2);
		
    if (ranks[0] > ranks[1]){
      points[0]=pointsWorth[0];
    }
    else if(ranks[1] < ranks[0]) {
      points[1]=pointsWorth[1];
    }
	else {
		pointsWorth = [pointsWorth[0]+1,pointsWorth[1]+1];
	}
  }

function runSpecialAbilties(rank1,rank2)
{
	if(rank1==5 || rank2==5){
		return(rank1,rank2)
	}
		
	return(rank1,rank2)

}
function prince(you,otherRank){
	if(otherRank!=1&&otherRank!=0){
		
	}
}
function general(you,otherRank){

}
function wizard(you,otherRank){

}
function ambassador(you,otherRank){

}
function assassin(you,otherRank){

}
function spy(you,otherRank){

}
function princess(you,otherRank){

}
function musician(you,otherRank){

}
//Finally, when you click a card in your hand, if it's
//the same suit or rank as the top card of the discard pile
//then it's added to it
lowerhand.click(function(card){
		
		card.moveTo(initMove,230);
		let upperVal = Math.floor(Math.random()*upperhand.length);
		upperhand[upperVal].showCard();
		upperhand[upperVal].moveTo(initMove,200);
		points = chooseWinner(card.rank,upperhand[upperVal].rank);
		upperhand.splice(upperVal,1);
		lowerhand = lowerhand.filter(hCard=>hCard!=card);
		initMove+=70;
		youShow.innerHTML="You: "+ points[0];
		compShow.innerHTML="Computer: "+points[1];
		//discardPile.addCard(card);
		//discardPile.render();
		//lowerhand.render();
	
});


//So, that should give you some idea about how to render a card game.
//Now you just need to write some logic around who can play when etc...
//Good luck :)
