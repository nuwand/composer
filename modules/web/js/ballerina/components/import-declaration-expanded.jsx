/**
 * Copyright (c) 2017, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import React from 'react';
import './import-declaration-expanded.css'
import ImageUtil from './image-util';
import PropTypes from 'prop-types';
import Renderer from './renderer';
import SuggestionsText from './suggestions-text';
import BallerinaEnvironment from '../env/environment';

export default class importDeclarationExpanded extends React.Component {
    constructor() {
        super();
        this.state = {
            showSuggestions: false,
        }
        this.packageSuggestions = BallerinaEnvironment.getPackages().map(p => {
            return {
                name: p.getName()
            }
        });
        this.handleAddImportClick = this.handleAddImportClick.bind(this);
        this.handleAddImportBlur = this.handleAddImportBlur.bind(this);
    }

    handleAddImportClick() {
        this.setState({showSuggestions: true})
    }

    handleAddImportBlur() {
        this.setState({showSuggestions: false})
    }

    render() {
        const bBox = this.props.bBox;
        const importDeclarationHeight = 30;
        const importInputHeight = 40;
        const importDeclarationWidth = 300;
        const leftPadding = 10;
        const topGutter = 10;
        const topBarHeight = 25;
        const iconSize = 20;
        const importElements = [];

        const topBarBbox = {
            x: bBox.x,
            y: bBox.y + topGutter
        }

        let lastImportElementY = topBarBbox.y + topBarHeight;

        this.props.imports.forEach((importDec, count) => {
            importElements.push(
                <g className='package-declaration-item' key={importDec.id}>
                    <rect x={ bBox.x } y={ lastImportElementY } height={importDeclarationHeight} width={importDeclarationWidth} />
                    <text x={ bBox.x + leftPadding } y={ lastImportElementY + importDeclarationHeight/2 } rx="0" ry="0">
                        {importDec._packageName}
                    </text>
                </g>
            );
            lastImportElementY += importDeclarationHeight;
        });

        const textBoxBBox = {
            x: bBox.x + 5,
            y: lastImportElementY + 2,
            h: importInputHeight - 4,
            w: importDeclarationWidth - 10
        };

        const options = {
            bBox: textBoxBBox,
            onChange: () => {},
            initialValue: '',
        }

        return (
            <g className="package-definitions-collection">
                <rect x={ topBarBbox.x } y={ topBarBbox.y } height={topBarHeight} width={importDeclarationWidth} style={ { fill: "#ddd"} } />
                <text x={ topBarBbox.x + leftPadding } y={ topBarBbox.y + topBarHeight/2} className="import-declaration-topbar-label">Imports</text>
                <image width={ iconSize } height={ iconSize } className="property-pane-action-button-delete"
                    onClick={this.props.onCollapse} xlinkHref={ ImageUtil.getSVGIconString('hide') }
                    x={bBox.x + importDeclarationWidth - iconSize - 6 } y={topBarBbox.y + (topBarHeight-iconSize)/2}/>
                {importElements}
                <rect x={ bBox.x } y={ lastImportElementY } height={importInputHeight} width={importDeclarationWidth}/>
                <g onClick={this.handleAddImportClick}>
                    <rect x={ bBox.x + 7 } y={ lastImportElementY + 7 } height={importInputHeight - 14} width={importDeclarationWidth - 14}
                        className="add-import-button" />
                    <text x={ bBox.x + 14 } y={ lastImportElementY + importInputHeight/2 } className="add-import-button-text" >{'+ Add Import'}</text>
                </g>
                <SuggestionsText x={ bBox.x + 5 } y={lastImportElementY + 5} height={importInputHeight - 10}
                    width={importDeclarationWidth - 10} suggestionsPool={this.packageSuggestions} show={this.state.showSuggestions}
                    onBlur={this.handleAddImportBlur} onEnter={this.props.onAddImport}/>
            </g>
        );
    }
}

importDeclarationExpanded.contextTypes = {
    renderer: PropTypes.instanceOf(Renderer).isRequired,
};
