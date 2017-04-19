import React, { PropTypes } from 'react';
import { Wrapper } from '/imports/react-ui/layout/components';

const propTypes = {
  customer: PropTypes.object.isRequired,
};

function FacebookSection({ customer }) {
  const { facebookData } = customer;

  if (!facebookData) {
    return null;
  }

  const { Title } = Wrapper.Sidebar.Section;

  return (
    <Wrapper.Sidebar.Section>
      <Title>Facebook</Title>
      <ul className="filters no-link">
        <li>
          ID
          <span className="counter">{facebookData.id}</span>
        </li>
      </ul>
    </Wrapper.Sidebar.Section>
  );
}

FacebookSection.propTypes = propTypes;

export default FacebookSection;
