import { makePayment } from '../../../actions/booking/makePayment';
import fetch from '../../../core/fetch';
import showToaster from '../../../helpers/toasterMessages/showToaster';

async function submit(values, dispatch) {

  if (values.year) {
    let now = new Date();
    let currentYear = now.getFullYear();
    let difference = currentYear - values.year;
    if (difference < 18) {
      //throw new SubmissionError({ _error: messages.mustBe18OrOld });
      showToaster({ messageId: 'checkAge', toasterType: 'error' })
      return false;
    }
  }

  let paymentType, name, cardNumber, cvv, expiryDate, expiryYear, paymentCurrency,
    dayDifference, month, monthValue, dateValue, dateOfBirth;
  paymentType = values.paymentType;
  name = values.paymentType == 2 ? values.name : null;
  cardNumber = values.paymentType == 2 ? values.cardNumber : null;
  cvv = values.paymentType == 2 ? values.cvv : null;
  expiryDate = values.paymentType == 2 ? values.expiryDate : null;
  expiryYear = values.paymentType == 2 ? values.expiryYear : null;
  paymentCurrency = values.paymentType == 1 ? values.paymentCurrency : null;
  dayDifference = values.dayDifference ? values.dayDifference + 1 : 0;
  month = values.month ? Number(values.month) + 1 : null;
  monthValue = Number(values.month) > 8 ? Number(month) : '0' + month;
  dateValue = values.day > 9 ? values.day : '0' + values.day;
  dateOfBirth = monthValue + "-" + dateValue + "-" + values.year;

  let query = `query checkReservation ($checkIn: String,$checkOut: String,$listId: Int ){
    checkReservation(checkIn: $checkIn, checkOut:$checkOut, listId:$listId ){
      id
      listId
      hostId
      guestId
      checkIn
      checkOut
      status
    }
  }`;

  const params = {
    listId: values.listId,
    checkIn: values.checkIn,
    checkOut: values.checkOut,
  };

  const resp = await fetch('/graphql', {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: params,
    }),
    credentials: 'include',
  });

  const { data } = await resp.json();

  if (data && data.checkReservation) {
    if (data.checkReservation.status == "200") {
      dispatch(makePayment(
        values.listId,
        values.listTitle,
        values.hostId,
        values.guestId,
        values.checkIn,
        values.checkOut,
        values.guests,
        values.message,
        values.basePrice,
        values.delivery,
        values.currency,
        values.discount,
        values.discountType,
        values.guestServiceFee,
        values.hostServiceFee,
        values.total,
        values.bookingType,
        paymentCurrency,
        paymentType,
        name,
        cardNumber,
        cvv,
        expiryDate,
        expiryYear,
        values.guestEmail,
        values.bookingSpecialPricing,
        values.isSpecialPriceAssigned,
        values.isSpecialPriceAverage,
        values.dayDifference,
        values.startTime,
        values.endTime,
        values.licenseNumber,
        values.firstName,
        values.middleName,
        values.lastName,
        dateOfBirth,
        values.country
      )
      );
    }
    else {
      showToaster({ messageId: 'bookingFailed', toasterType: 'error' })
    }

  }



  //dispatch(reset('PaymentForm'));
}

export default submit;
