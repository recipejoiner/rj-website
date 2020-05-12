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
    <img
      className="h-40 w-40 m-auto mt-20"
      src={require('images/logos/rj-logo.svg')}
    />
		<div className="text-center mt-5">
      Welcome to RecipeJoiner! Anyone can cook, and this is a home for all who consider themselves to be a chef.
    </div>
	</React.Fragment>
);

export default Home;