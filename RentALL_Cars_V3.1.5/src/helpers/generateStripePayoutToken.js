import showErrorMessage from "./showErrorMessage";

async function generateStripePayoutToken(stripe, values) {
    try {
        let status = 200, errorMessage, createPersonToken;
        let accountToken, personToken, person = {};
        let business_type = values.businessType || 'individual';
        let account = {
            business_type,
            tos_shown_and_accepted: true
        };

        if (business_type === 'individual') {
            account['individual'] = {
                email: values.email,
                first_name: values.firstname,
                last_name: values.lastname,
                address: {
                    line1: values.address1,
                    city: values.city,
                    state: values.state,
                    country: values.country,
                    postal_code: values.zipcode
                }
            };
        } else {
            account['company'] = {
                name: values.firstname,
                address: {
                    line1: values.address1,
                    city: values.city,
                    state: values.state,
                    country: values.country,
                    postal_code: values.zipcode
                }
            };
        };

        const createAccountToken = await stripe.createToken('account', account);

        if (business_type === 'company') {
            person = {
                email: values.email,
                address: {
                    line1: values.address1,
                    city: values.city,
                    state: values.state,
                    country: values.country,
                    postal_code: values.zipcode
                },
                relationship: {
                    representative: true
                }
            };

            createPersonToken = await stripe.createToken('person', { person });
        };

        if (createAccountToken.token && (business_type !== 'company' || (business_type === 'company' && createPersonToken.token))) {
            accountToken = createAccountToken.token && createAccountToken.token.id;
            personToken = createPersonToken && createPersonToken.token && createPersonToken.token.id;
        } else {
            status = 400;
            if (!createAccountToken.token) {
                errorMessage = createAccountToken.message || (createAccountToken.error && createAccountToken.error.message);
            } else if (!createPersonToken.token) {
                errorMessage = createPersonToken.message || (createPersonToken.error && createPersonToken.error.message);
            } else {
                errorMessage = await showErrorMessage({ errorCode: 'unableToProceed' })
            }
        };

        return await {
            status,
            errorMessage,
            result: {
                accountToken,
                personToken
            }
        };
    } catch (error) {
        return {
            status: 400,
            errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
        };
    };
}

export default generateStripePayoutToken;