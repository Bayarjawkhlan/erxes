import GenerateField from '@erxes/ui-forms/src/settings/properties/components/GenerateField';
import { Box, Button, getEnv, Icon, SectionBodyItem, Tip, __ } from '@erxes/ui/src';
import { ModalFooter } from '@erxes/ui/src/styles/main';
import React from 'react';
import { ProductName } from '../../styles';

type Props = {
  fields: any;
  submissions: any;
  formId: string;
  formSubmissionsSave: (doc: any) => any;
  closeModal: () => void;
};

type State = {
  submissions: object;
};
class SubmissionsComponent extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      submissions: this.props.submissions || {}
    };

    this.handleSumbmissionForm = this.handleSumbmissionForm.bind(this);
  }

  handleSumbmissionForm() {
    const { formSubmissionsSave, formId } = this.props;

    const { submissions } = this.state;

    formSubmissionsSave({
      formSubmissions: submissions,
      formId
    });
  }

  renderForm() {
    const { fields } = this.props;
    const { submissions } = this.state;

    const handleChange = field => {
      submissions[field._id] = field.value;
      this.setState({ submissions });
    };

    return fields.map(field => (
      <GenerateField
        isEditing={true}
        defaultValue={submissions[field._id]}
        key={field._id}
        field={field}
        onValueChange={handleChange}
        isPreview={true}
      />
    ));
  }

  render() {
    const { closeModal } = this.props;

    return (
      <div>
        {this.renderForm()}
        <ModalFooter>
          <Button btnStyle="simple" onClick={closeModal}>
            Cancel
          </Button>
          <Button btnStyle="success" onClick={this.handleSumbmissionForm}>
            Submit
          </Button>
        </ModalFooter>
      </div>
    );
  }
}

export default SubmissionsComponent;
