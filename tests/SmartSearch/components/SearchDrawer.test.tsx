import React from 'react';
import {shallow, mount, render} from 'enzyme';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import SearchDrawer from "../../../components/Drawer/SmartSearch/SearchDrawer";
import {assignmentDocument, userDocument} from "../../../modules/SmartSearch/documents";

// Configure Enzyme to use React 16 adapter
Enzyme.configure({adapter: new Adapter()});

// React component shallow testing using Enzyme
describe('SearchDrawer React component tests', () => {
    test('Admin should have option to select document type', () => {
        const searchDrawer = shallow(<SearchDrawer admin={true}/>);
        expect(searchDrawer.find('CheckboxSelect').exists()).toBeTruthy()
    })
    test('Students dont have option to select document type', () => {
        const searchDrawer = shallow(<SearchDrawer admin={false}/>);
        expect(searchDrawer.find('CheckboxSelect').exists()).toBeFalsy()
    })
    test('Searching actually changes value of search box because it is controlled component', () => {
        const searchDrawer = shallow(<SearchDrawer admin={false}/>);
        const searchQuery = "testQuery"
        // Simulate searching event
        searchDrawer.simulate('SearchInput', {
            target: {value: searchQuery}
        })
        expect(searchDrawer.prop('value')).toBe(searchQuery)
    })
})

export {}