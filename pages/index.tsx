import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';

import Banner from 'components/homepage/Banner';

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
    <Banner />
	</React.Fragment>
);

export default Home;