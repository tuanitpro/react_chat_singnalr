import React from 'react';
import Chat from './Chat';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { shallow } from 'enzyme';
Enzyme.configure({ adapter: new Adapter() });

const signalR = require("@aspnet/signalr");
// jest.mock('signalR');

describe('Chat component', () => {
    it('render', (done) => {
        const component = shallow(<Chat />);
        expect(component).toMatchSnapshot();
    });

})