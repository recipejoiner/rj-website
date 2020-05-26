import { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import Banner from 'components/homepage/Banner';
import { AllRecipesFeed, UserRecipesFeed } from 'components/homepage/RecipeFeed';
import UserContext from 'helpers/UserContext';

type Props = {}

const Home: NextPage<Props> = ({}) => {
	const { isLoggedIn } = React.useContext(UserContext);
	return(
		<React.Fragment>
			<Head>
				<script key="data-layer" dangerouslySetInnerHTML={{
					__html: `
						dataLayer = [{
							'ecomm_pagetype' : 'home'
						}]      
					`}}
				/>
			</Head>
			{
				isLoggedIn
				?
				<React.Fragment>
					<UserRecipesFeed />
				</React.Fragment>
				:
				<React.Fragment>
					<Banner />
					<AllRecipesFeed />
				</React.Fragment>
			}
		</React.Fragment>
	);
}

export default Home;
