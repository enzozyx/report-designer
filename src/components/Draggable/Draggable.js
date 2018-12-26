import React, { Component } from 'react';
import * as ReactDraggable from 'react-draggable';
import { Resizable } from 'react-resizable';
import './Draggable.css';
import { connect } from 'react-redux';
import { makeElementActive, updateProperties } from '../../redux/actions';
import PropTypes from 'prop-types';

class Draggable extends Component {
  state = { width: 0, height: 0, isActive: false };

  onSelectItem = () => {
    if (
      !this.props.activeElement ||
      this.props.activeElement.id !== this.props.id
    ) {
      this.props.makeElementActive(this.props.id);
    }
  };

  componentDidMount = () => {
    this.setState({
      width: this.props.properties.size.w,
      height: this.props.properties.size.h
    });
  };

  onResize = (event, data) => {
    this.onSelectItem();

    const { element, size } = data;
    const { width, height } = size;

    this.setState({ width, height }, () => {
      if (this.props.onResize) {
        this.props.onResize(event, { element, size: { width, height } });
      }
    });
  };

  onStartDrag = () => {
    this.onSelectItem();
  };

  onDrag = (event, data) => {
    if (
      this.props.activeElement &&
      this.props.activeElement.id === this.props.id
    ) {
      this.props.updateProperties('location', {
        x: data.x,
        y: data.y
      });
    }
  };

  render() {
    const { width, height } = this.state;
    const { id, activeElement, properties } = this.props;

    return (
      <ReactDraggable
        onStart={ () => this.onStartDrag() }
        bounds="parent"
        onDrag={ this.onDrag }
        defaultPosition={ {
          x: properties.location.x,
          y: properties.location.y
        } }
        cancel=".react-resizable-handle"
      >
        <Resizable
          className="box"
          height={ height }
          width={ width }
          onResize={ this.onResize.bind(this) }
          draggableOpts={ { onResize: e => e.stopPropagation() } }
        >
          <div
            onClick={ () => this.onSelectItem() }
            className={ `draggable ${
              activeElement && id === activeElement.id ? 'active' : ''
            }` }
            style={ { width: width, height: height } }
          >
            {this.props.children}
          </div>
        </Resizable>
      </ReactDraggable>
    );
  }
}

const mapStateToProp = state => {
  return {
    ...state,
    activeElement: state.appReducers.activeElement
  };
};

Draggable.propTypes = {
  children: PropTypes.object,
  id: PropTypes.string,
  activeElement: PropTypes.object,
  style: PropTypes.object,
  properties: PropTypes.object,
  onResize: PropTypes.func,
  makeElementActive: PropTypes.func,
  updateProperties: PropTypes.func
};

export default connect(
  mapStateToProp,
  {
    makeElementActive,
    updateProperties
  }
)(Draggable);
