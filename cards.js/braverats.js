
//Tell the library which element to use for the table
cards.init({table:'#card-table', type:STANDARD});
initMove=-10;
let pointsWorth = [1,1];
let scores = [0,0];
let compShow = document.getElementById('comp');	
let youShow = document.getElementById('you');	
let abilities = [musician,princess,spy,assassin,ambassador,wizard,general,prince];
let generalPower=[0,0]
let spyVal = null;
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
function chooseWinner (cards){
	cards = runSpecialAbilties(cards);
		
    if (cards["rank"][0] > cards["rank"][1]){
      cards["pointsStorer"][0]+=cards["pointsWorth"][0];
	  cards["pointsWorth"][0]=1;
	  cards["pointsWorth"][1]=1;

    }
    else if(cards["rank"][1] > cards["rank"][0]) {
		cards["pointsStorer"][1]+=cards["pointsWorth"][1];
		cards["pointsWorth"][1]=1;
		cards["pointsWorth"][0]=1;


    }
	else {
		cards["pointsWorth"] = [cards["pointsWorth"][0]+1,cards["pointsWorth"][1]+1];
	}
	return cards;
  }
function otherNumber(number){
	if(number==1){
		return(0);
	}
	return(1);
}
function runSpecialAbilties(cards)
{	
	cards["rank"][0]+=cards["generalPower"][0];
	cards["rank"][1]+=cards["generalPower"][1];

	if(cards["immutableRank"][0]==5 || cards["immutableRank"][1]==5){
		return(cards);
	}
	cards = abilities[cards["immutableRank"][0]](cards,0)	
	cards = abilities[cards["immutableRank"][1]](cards,1)	

	return(cards);

}
function prince(cards,player){
	if(cards["immutableRank"][otherNumber(player)]!=1
	&&cards["immutableRank"][otherNumber(player)]!=7
	&&cards["immutableRank"][otherNumber(player)]!=0){
	cards["rank"]=[0,0];
	cards["pointsStorer"][player]+=cards["pointsWorth"][player];
	cards["pointsWorth"]=[0,0];	

	}
	return cards;
}

function general(cards,player){
	cards["generalPower"][player]=2;
	return cards;
}
function wizard(cards,player){
	return cards;

}
function ambassador(cards,player){
	cards["pointsWorth"][player]=cards["pointsWorth"][player]+1;
	return cards;

}
function assassin(cards,player){
	cards["rank"]=[-cards["rank"][0],-cards["rank"][1]];
	return cards;
}
function spy(cards,player){
	if(player===0&&cards["realGame"]==true){
		cards["spyVal"] =playComputer();
		
	}
	return cards;
}
function princess(cards,player){
	if(cards["immutableRank"][otherNumber(player)]==7){
		cards["rank"]=[0,0];
		cards["pointsStorer"][player]+=4;
		cards["pointsWorth"]=[0,0];		
	}
	return cards;
}
function musician(cards,player){
	cards["rank"]=[0,0];
	return cards;
}
function basicBot(){
	let upperHandCards = []
	let lowerHandCards = []
	for(i=0; i<=7;i++){
		if(i in upperhand){
			upperHandCards.push(i);
		}
		if(i in lowerhand){
			lowerHandCards.push(i);
		}

	
	
	}
	let maxWins = [0,0];
	let winners = [0,0]
	for(i=0; i< upperHandCards.length;i++){
		wins=0;
		for(j=0; j< lowerHandCards.length;j++){
			let cards = {"immutableRank":[lowerhand[j].rank-1,upperhand[i].rank-1],"rank":[lowerhand[j].rank-1,upperhand[i].rank-1],"pointsWorth":[1,1],"pointsStorer":[0,0],"generalPower":[0,0],spyVal:null, "realGame":false};
			wins+=chooseWinner(cards)["pointsStorer"][1];

		}	
		if (wins>maxWins[0]){
			maxWins[0]=wins;
			winners[0]=i;
		
		}	
		else if (wins>maxWins[1]){
			maxWins[1]=wins;
			winners[1]=i;
		}
	
}
	return(maxWins[Math.floor(Math.random()*2)])
}
function factorial(num){
	if(num>1){
	return(num*factorial(num-1))}
}
function complicatedBot(){
	let upperHandCards = []
	let lowerHandCards = []
	for(i=upperhand.length-1; i>=0;i--){
		upperHandCards.push(upperhand[i].rank-1)
		lowerHandCards.push(lowerhand[i].rank-1)

	}
	
	
	wins=[];

	for(i=0; i< upperHandCards.length;i++){
		wins.push(0);
		for(j=0; j< lowerHandCards.length;j++){
			let cards = {"immutableRank":[lowerhand[j].rank-1,upperhand[i].rank-1],"rank":[lowerhand[j].rank-1,upperhand[i].rank-1],"pointsWorth":pointsWorth,"pointsStorer":[0,0],"generalPower":[0,0],spyVal:null, "realGame":false};
			result=chooseWinner(cards);
			splicer1=[...upperHandCards];
			splicer1.splice((cards.immutableRank[1]));
			splicer2=[...lowerHandCards];
			splicer2.splice((cards.immutableRank[0]));

			wins[i]+=botProcces(result["pointsStorer"],result["pointsWorth"],splicer1,splicer2,result["generalPower"]);
		}	
			
}
	//console.log(winners)
	return (wins.indexOf(Math.max(...wins)));	
}
function botProcces(points,pointsWorth,upperhandp,lowerhandp, generalHappened){
	let upperHandCards = []
	let lowerHandCards = []
	for(i=0; i<=7;i++){
		if(upperhandp.includes(i)){
			upperHandCards.push(i);
		}
		if(lowerhandp.includes(i)){
			lowerHandCards.push(i);
		}

	
	
	}
	for(i=0; i< upperHandCards.length;i++){
		wins.push(0);
		for(j=0; j< lowerHandCards.length;j++){
			let cards = {"immutableRank":[lowerHandCards[j],upperHandCards[i]],"rank":[lowerHandCards[j].rank,upperHandCards[i].rank],"pointsWorth":pointsWorth,"pointsStorer":points,"generalPower":generalHappened,spyVal:null, "realGame":false};
			result=chooseWinner(cards);
			if (result["pointsStorer"][0]>=4){
				return(factorial(upperHandCards.length))
			}
			if (result["pointsStorer"][1]>=4||upperHandCards.length<1){
				return(0)
			}
			console.log(result["pointsStorer"])
			splicer1=[...upperHandCards];
			splicer1.splice(splicer1.indexOf(cards.immutableRank[0]),1);
			splicer2=[...lowerHandCards];
			splicer2.splice(splicer1.indexOf(cards.immutableRank[0]),1);

			return(botProcces(result["pointsStorer"],result["pointsWorth"],splicer1,splicer2,result["generalPower"]));
		}	
			
}

}
function playComputer(){
	initMove+=70;
	let upperValue = basicBot(); //Math.floor(Math.random()*upperhand.length);
	upperhand[upperValue].showCard();
	upperhand[upperValue].moveTo(initMove,200);
	upperhand.splice(upperValue,1);
	return(upperValue)
}
function removeEverything(){
	while(upperhand.length>0){
		upperhand.removeCard(upperhand[0])
	}
	while(lowerhand.length>0){
		lowerhand.removeCard(lowerhand[0])
	}
}
//Finally, when you click a card in your hand, if it's
//the same suit or rank as the top card of the discard pile
//then it's added to it
lowerhand.click(function(card){
		upperVal=spyVal;
		if(spyVal==null){
			upperVal = playComputer();
		}
		spyVal=null;
		card.moveTo(initMove,230);
		
		let cards = {"immutableRank":[card.rank-1,upperhand[upperVal].rank],"rank":[card.rank-1,upperhand[upperVal].rank],"pointsWorth":pointsWorth,"pointsStorer":scores,"generalPower":generalPower,spyVal:null,"realGame":true};
		cards =chooseWinner(cards);
		scores[0] = cards["pointsStorer"][0];
		scores[1] = cards["pointsStorer"][1];
		spyVal=cards["spyVal"];
		
		pointsWorth[0]=cards["pointsWorth"][0];
		pointsWorth[1]=cards["pointsWorth"][1];
		generalPower=cards["generalPower"];

		//upperhand.splice(upperVal,1);
		lowerhand = lowerhand.filter(hCard=>hCard!=card);
		youShow.innerHTML="You: "+ scores[0];
		compShow.innerHTML="Computer: "+scores[1];
	
		//discardPile.addCard(card);
		//discardPile.render();
		//lowerhand.render();
		if(scores[1]>=4){
			alert("Computer won")
			location.reload();

		}
		if(scores[0]>=4){
			alert("You won")
			location.reload();

		}
});



//So, that should give you some idea about how to render a card game.
//Now you just need to write some logic around who can play when etc...
//Good luck :)
