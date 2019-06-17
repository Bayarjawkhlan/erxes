import { EditorState } from 'draft-js';
import {
  ControlLabel,
  FormControl,
  FormGroup
} from 'modules/common/components';
import {
  createStateFromHTML,
  ErxesEditor,
  toHTML
} from 'modules/common/components/editor/Editor';
import { IFormProps } from 'modules/common/types';
import { __ } from 'modules/common/utils';
import { SelectBrand } from 'modules/settings/integrations/containers';
import * as React from 'react';
import { Form as CommonForm } from '../../common/components';
import { ICommonFormProps } from '../../common/types';
import { IResponseTemplate } from '../types';

type Props = {
  object?: IResponseTemplate;
};

type State = {
  editorState: EditorState;
};

class Form extends React.Component<Props & ICommonFormProps, State> {
  constructor(props) {
    super(props);

    const object = props.object || {};

    this.state = {
      editorState: createStateFromHTML(
        EditorState.createEmpty(),
        object.content || ''
      )
    };
  }

  getContent = editorState => {
    return toHTML(editorState);
  };

  onChange = editorState => {
    this.setState({ editorState });
  };

  generateDoc = (values: { _id?: string; name: string; brandId: string }) => {
    const { object } = this.props;
    const finalValues = values;

    if (object) {
      finalValues._id = object._id;
    }

    return {
      _id: finalValues._id,
      brandId: finalValues.brandId,
      name: finalValues.name,
      content: this.getContent(this.state.editorState)
    };
  };

  renderContent = (formProps: IFormProps) => {
    const object = this.props.object || ({} as IResponseTemplate);

    const props = {
      editorState: this.state.editorState,
      onChange: this.onChange,
      defaultValue: object.content
    };

    return (
      <React.Fragment>
        <FormGroup>
          <SelectBrand
            formProps={formProps}
            isRequired={true}
            defaultValue={object.brandId}
          />
        </FormGroup>

        <FormGroup>
          <ControlLabel required={true}>Name</ControlLabel>
          <FormControl
            {...formProps}
            name="name"
            defaultValue={object.name}
            required={true}
          />
        </FormGroup>

        <FormGroup>
          <ControlLabel>Content</ControlLabel>
          <ErxesEditor bordered={true} {...props} />
        </FormGroup>
      </React.Fragment>
    );
  };

  render() {
    return (
      <CommonForm
        {...this.props}
        name="response template"
        renderContent={this.renderContent}
        generateDoc={this.generateDoc}
        object={this.props.object}
      />
    );
  }
}

export default Form;
