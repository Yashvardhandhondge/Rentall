import messages from '../../../locale/messages';
import { inputDescLimit, inputTextLimit } from '../../../helpers/fieldRestriction';

const validate = values => {

  const errors = {}

  if (!values.itemName) {
    errors.itemName = messages.required;
  } else if (values.itemName && values.itemName.trim() == "") {
    errors.itemName = messages.required;
  } else if (values.itemName && values?.itemName?.length > inputTextLimit) {
    errors.itemName = messages.inputTextLimitError;
  }

  if (!values.otherItemName) {
    errors.otherItemName = messages.required;
  } else if (values.otherItemName && values.otherItemName.trim() == "") {
    errors.otherItemName = messages.required;
  } else if (values?.otherItemName?.length > inputTextLimit) {
    errors.otherItemName = messages.inputTextLimitError;
  }

  if (values.startValue != 0 && values.startValue < 0) {
    if (Number(values.startValue) || Number(values.startValue) != parseInt(values.startValue, 10)) {
      errors.startValue = messages.startValueIsInvalid;
    }
  }

  if (!Number(values.endValue) || Number(values.endValue) != parseInt(values.endValue, 10)) {
    errors.endValue = messages.endValueIsInvalid;
  }

  if (Number(values.endValue) < Number(values.startValue)) {
    errors.endValue = messages.endValueGreater;
  }

  if (values.itemDescription && values.itemDescription.trim() == "") {
    errors.itemDescription = messages.blankSpace;
  } else if (values?.itemDescription?.length > inputDescLimit) {
    errors.itemDescription = messages.inputDescLimitError;
  }

  if(!values.makeType) {
    errors.makeType = messages.required;
  }


  return errors
}

export default validate