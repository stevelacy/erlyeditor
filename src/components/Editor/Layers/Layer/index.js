import { autobind } from 'core-decorators';
import React, { Component, PropTypes } from 'react';
import css from 'react-css-modules';

import {
  filterShape,
  filterTypeShape,
  filterActionsShape,
  layerActionsShape
} from '../../../propTypes';

import Header from './Header';
import Surface from './Surface';

import styles from './styles';

const {
  bool,
  number,
  string,
  object,
  arrayOf,
  shape
} = PropTypes;

export class Layer extends Component {
  static propTypes = {
    className: string,
    snapToGrid: bool,
    cellSize: number,

    id: string.isRequired,
    name: string.isRequired,
    description: string.isRequired,
    type: string.isRequired,
    attributes: object,
    filters: arrayOf(filterShape),
    filterTypes: arrayOf(filterTypeShape).isRequired,
    editable: bool,
    disabled: bool,
    locked: bool,
    single: bool,

    actions: shape({
      layer: layerActionsShape.isRequired,
      filter: filterActionsShape.isRequired
    })
  };

  state = { expanded: true };

  @autobind
  handleToggleExpanded() {
    const expanded = !this.state.expanded;
    this.setState({ expanded });
  }

  @autobind
  handleMoveFilter(filterId, sourceLayerId, targetLayerId, offset) {
    if (sourceLayerId !== targetLayerId) {
      this.props.actions.layer.removeFilter(sourceLayerId, filterId);
      this.props.actions.layer.addFilter(targetLayerId, filterId);
    }
    this.props.actions.filter.move(filterId, offset);
  }

  @autobind
  handleDestroyFilter(id) {
    this.props.actions.layer.removeFilter(this.props.id, id);
    this.props.actions.filter.destroy(id);
  }

  render() {
    const {
      className,

      snapToGrid,
      cellSize,
      filters,
      filterTypes,

      id,
      name,
      description,
      type,
      editable,
      disabled,
      locked,
      single,

      actions
    } = this.props;

    const { expanded } = this.state;

    const headerProps = {
      name,
      description,
      editable,
      disabled,
      locked,
      single,
      expanded
    };

    const surfaceProps = {
      id,
      type,
      snapToGrid,
      cellSize,
      filters,
      filterTypes
    };

    return (
      <div styleName='layer' className={className}>
        <Header {...headerProps}
          onToggleExpanded={this.handleToggleExpanded}
        />
        <Surface {...surfaceProps}
          onMoveFilter={this.handleMoveFilter}
          onDestroyFilter={this.handleDestroyFilter}
          onToggleFilterVisibility={actions.filter.toggleVisibility}
          onToggleFilterLocked={actions.filter.toggleLocked}
        />
      </div>
    );
  }
}

Layer.Header = Header;
Layer.Surface = Surface;

export default css(Layer, styles, { allowMultiple: true });
