function buildPreference(data) {
  const { id, items, customer } = data;
  const mpItems = _buildPreferenceItems(items);
  const excludedPaymentTypes = [
    { id: 'ticket' },
    { id: 'atm' }
    // { id: 'credit_card' }
  ];

  const testCustomer = {
    id: 613497413,
    nickname: 'TESTRQFT8LGC',
    password: 'qatest3623',
    site_status: 'active',
    email: 'test_user_34339199@testuser.com'
  };

  // const testSeller = {
  //   id: 614352138,
  //   nickname: 'TESTH3QHQ6CQ',
  //   password: 'qatest2688',
  //   site_status: 'active',
  //   email: 'test_user_42045796@testuser.com'
  // };

  return {
    items: [...mpItems],
    external_reference: `preference-order-${id}`,
    payer: {
      name: customer.firstName,
      surname: customer.lastName,
      email: testCustomer.email,
      phone: {
        area_code: customer.phone.areaCode,
        number: customer.phone.number
      },
      address: {
        zip_code: customer.address.zipCode,
        street_name: customer.address.street,
        street_number: customer.address.number
      }
    },
    payment_methods: {
      excluded_payment_types: excludedPaymentTypes,
      installments: 1,
      default_installments: 1
    },
    back_urls: {
      success: `${process.env.UI_BASE_URL}/payments`,
      pending: `${process.env.UI_BASE_URL}/payments`,
      failure: `${process.env.UI_BASE_URL}/payments`
    },
    notification_url: `${process.env.API_URL}:${process.env.PORT}/${process.env.API_VER}/payments/webhook`,
    auto_return: 'approved'
  };
}

function _buildPreferenceItems(items) {
  return items.map(item => {
    const { quantity, pizza } = item;
    return {
      id: pizza.id,
      title: pizza.name,
      description: `Pizza con ${pizza.ingredients.join(', ')}`,
      picture_url: `${process.env.UI_BASE_URL}/assets/img/${pizza.id}.png`,
      category_id: 'pizzas',
      quantity,
      currency_id: 'ARS',
      unit_price: 1 // pizza.price
    };
  });
}

module.exports = {
  buildPreference
};
