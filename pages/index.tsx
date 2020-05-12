import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';

type Props = {}

const Home: NextPage<Props> = ({}) => (
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
		<div>
      Welcome to RecipeJoiner! Anyone can cook, and this is a home for all who consider themselves a chef.
    </div>
	</React.Fragment>
);

export default Home;