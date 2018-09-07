import {Component, OnInit} from "@angular/core";
import {
  BlockCalculatorAnswers,
  BlockCalculatorCard,
  OptionInput,
  SelectInput,
  TextInput
} from "./block-calculator.model";
import {BlockCalculatorService} from "../../../services/block-calculator.service";

@Component({
  templateUrl: './block-calculator.html',
  styles: [`
    .block-calculator {
      min-height: 70vh;
    }
  `]
})
export class BlockCalculatorComponent implements OnInit {
  
  blockCalculatorAnswers: BlockCalculatorAnswers = new BlockCalculatorAnswers();
  
  blockCalculatorPage = 1;
  
  blockCalculatorCards: [BlockCalculatorCard] = [] as [BlockCalculatorCard];
  
   constructor(private blockCalculatorService: BlockCalculatorService) {}
  
  ngOnInit() {
    this.buildAllCards();
  }
  
  buildAllCards() {
    this.clearAllCards();
    this.addIntroCard();
    this.addBodyFatCard();
    this.addBodyWeightCard();
    this.addActivityLevelCard();
    this.addGoalsCard();
  }
  
  addIntroCard(order?: number) {
    let card = new BlockCalculatorCard();
    card.imgAlt = '';
    card.imgSrc = '';
    card.title = 'Let\'s Get Started';
    card.paragraph = 'Answer the following questions to get your customized Zone Block Prescription.';
    if(!order)
      order = this.blockCalculatorCards.length + 1;
    card.order = order;
    this.incrementCardOrderIfOrderExists(order);
    this.blockCalculatorCards.push(card);
  }
  
  addBodyFatCard(order?: number) {
    let card = new BlockCalculatorCard();
    card.imgAlt = '';
    card.imgSrc = '';
    card.title = 'Body Mass Index';
    let input = new TextInput();
    input.label = 'What is your BMI';
    input.postLabel = '%';
    input.type = 'number';
    card.input = input;
    card.paragraph = 'Here is some additional resources on how to calculate your BMI.';
    if(!order)
      order = this.blockCalculatorCards.length + 1;
    card.order = order;
    this.incrementCardOrderIfOrderExists(order);
    this.blockCalculatorCards.push(card);
  }
  
  addBodyWeightCard(order?: number) {
    let card = new BlockCalculatorCard();
    card.imgAlt = '';
    card.imgSrc = '';
    card.title = 'Body Weight';
    let input = new TextInput();
    input.label = 'What is your Body Weight in Pounds';
    input.postLabel = 'lbs';
    input.type = 'number';
    card.input = input;
    card.paragraph = 'Here is some additional resources on how to calculate your BMI.';
    if(!order)
      order = this.blockCalculatorCards.length + 1;
    card.order = order;
    this.incrementCardOrderIfOrderExists(order);
    this.blockCalculatorCards.push(card);
  }
  
  addActivityLevelCard(order?: number) {
    let card = new BlockCalculatorCard();
    card.imgAlt = '';
    card.imgSrc = '';
    card.title = 'Activity Level';
    let select = new SelectInput();
    select.options = [] as [OptionInput];
    ['Sitting Most of the Day', 'Up and Down a Few Times a Day', 'On Feet most of the Day', 'Professional Athlete'].forEach(opt => {
      let option = new OptionInput();
      option.label = opt;
      option.value = opt;
      select.options.push(option);
    });
    select.label = 'How active on average are you through out the day';
    card.select = select;
    card.paragraph = 'Here is some additional resources on how to calculate your BMI.';
    if(!order)
      order = this.blockCalculatorCards.length + 1;
    card.order = order;
    this.incrementCardOrderIfOrderExists(order);
    this.blockCalculatorCards.push(card);
  }
  
  addGoalsCard(order?: number) {
    let card = new BlockCalculatorCard();
    card.imgAlt = '';
    card.imgSrc = '';
    card.title = 'Nutrition Goals';
    let select = new SelectInput();
    select.options = [] as [OptionInput];
    ['Lose Weight', 'Gain Mass', 'Eat Healthier', 'Athletic Performance', 'Baseline'].forEach(opt => {
      let option = new OptionInput();
      option.label = opt;
      option.value = opt;
      select.options.push(option);
    });
    select.label = 'What is your main nutritional goal';
    card.select = select;
    card.paragraph = 'Here is some additional resources.';
    if(!order)
      order = this.blockCalculatorCards.length + 1;
    card.order = order;
    this.incrementCardOrderIfOrderExists(order);
    this.blockCalculatorCards.push(card);
  }
  
  clearAllCards() {
    this.blockCalculatorCards = [] as [BlockCalculatorCard];
    this.blockCalculatorAnswers = new BlockCalculatorAnswers();
  }
  
  incrementCardOrderIfOrderExists(order: number) {
    if(this.blockCalculatorCards.some(c => c.order === order)) {
      this.blockCalculatorCards.filter(c => c.order >= order).forEach(c => {
        c.order += 1;
      });
    }
  }
  
  updateResult(tab:number, value:any) {
    const card = this.blockCalculatorCards.find(c => c.order === tab);
    console.log(card);
    if(card) {
      if(card.title === 'Body Mass Index') {
        this.blockCalculatorAnswers.percentBodyFat = value;
      } else if(card.title === 'Body Weight') {
        this.blockCalculatorAnswers.bodyWeight = value;
      } else if(card.title === 'Activity Level') {
        this.blockCalculatorAnswers.activityLevel = value;
      } else if(card.title === 'Nutrition Goals') {
        this.blockCalculatorAnswers.goals = value;
      }
      this.nextCard();
      this.calculateResults();
    }
  }
  
  calculateResults() {
    if(this.blockCalculatorAnswers && this.blockCalculatorAnswers.percentBodyFat && this.blockCalculatorAnswers.bodyWeight &&
      this.blockCalculatorAnswers.activityLevel && this.blockCalculatorAnswers.goals) {
      this.blockCalculatorAnswers.result.blocks = this.blockCalculatorService.
      getBlocks(this.blockCalculatorAnswers.percentBodyFat, this.blockCalculatorAnswers.bodyWeight,
        this.blockCalculatorAnswers.activityLevel, this.blockCalculatorAnswers.goals);
    }
  }
  
  nextCard(): void {
    this.blockCalculatorPage += 1;
  }
  backCard(): void {
    this.blockCalculatorPage -= 1;
  }
  
  disableBackBtn(): boolean {
    return this.blockCalculatorPage <= 1;
  }
  disableNextBtn(): boolean {
    return false; //TODO more logic
  }
}
