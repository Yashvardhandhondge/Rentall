import fetch from '../../../../core/fetch';
import showToaster from '../../../../helpers/toasterMessages/showToaster';

async function submit(values, dispatch) {
  const query = `
  mutation (
    $whyBlockTitle1: String
    $whyBlockContent1: String
    $whyBlockTitle2: String
    $whyBlockContent2: String
    $whyBlockImage1: String
    $whyBlockImage2: String
) {
  updateWhyHostPage (
    whyBlockTitle1: $whyBlockTitle1
    whyBlockContent1: $whyBlockContent1
    whyBlockTitle2: $whyBlockTitle2
    whyBlockContent2: $whyBlockContent2
    whyBlockImage1: $whyBlockImage1
    whyBlockImage2: $whyBlockImage2
  ) {
      status
  }
}

  `;

  const resp = await fetch('/graphql', {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: query,
      variables: values
    }),
    credentials: 'include',
  });

  const { data } = await resp.json();

  if (data.updateWhyHostPage.status === "success") {
    showToaster({ messageId: 'updateWhyHostPage', toasterType: 'success' })
  } else {
    showToaster({ messageId: 'updateWhyHostPageFailed', toasterType: 'error' })
  }

}

export default submit;
