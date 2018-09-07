export class TextInput {
  label: string;
  value: string;
  placeholder: string;
  postLabel?: string;
  type: string;
}
export class SelectInput extends TextInput {
  options: [OptionInput] = [] as [OptionInput];
  value: any;
}

export class OptionInput {
  label: string;
  value: any;
}

export class BlockCalculatorAnswers {
  percentBodyFat: number;
  bodyWeight: number;
  activityLevel: string;
  goals: string;
  result: BlockCalculatorResult = new BlockCalculatorResult();
}

export class BlockCalculatorResult {
  blocks: number;
}
export class BlockCalculatorCard {
  order: number;
  imgSrc?: string;
  imgAlt?: string;
  title?: string;
  paragraph?: string;
  input?: TextInput;
  select?: SelectInput;
}
