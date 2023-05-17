<script>
	import { onMount } from 'svelte';
	import { getMonthData, getPrevMonth, getNextMonth } from '../helpers/helpers';
	let date = new Date();
	let monthData;
	let selectedDay;
	let showDayDetails = false;
	let showAddEvent = false;

	let eventTitle = '';
	let eventStart = '';
	let eventEnd = '';
	let eventDescription = '';
	let eventName = '';

	const selectDay = (day) => {
		selectedDay = day;
		showDayDetails = true;
	};

	const goBack = () => {
		showDayDetails = false;
	};

	const openAddEvent = () => {
		showAddEvent = true;
	};

	const closeAddEvent = () => {
		showAddEvent = false;
		eventTitle = '';
		eventStart = '';
		eventEnd = '';
		eventDescription = '';
		eventName = '';
	};

	const saveEvent = () => {
		selectedDay.event = {
			title: eventTitle,
			start: eventStart,
			end: eventEnd,
			description: eventDescription,
			name: eventName
		};
		closeAddEvent();
	};

	const updateMonth = (newDate) => {
		date = newDate;
		monthData = getMonthData(date);
	};

	onMount(() => {
		monthData = getMonthData(date);
	});
</script>

{#if showDayDetails}
	<div class="full-screen">
		<button on:click={goBack}>Back</button>
		<h2>Selected day: {selectedDay.date.toDateString()}</h2>
		<p>{selectedDay.details}</p>
		{#if selectedDay.event}
			<div>
				<h3>{selectedDay.event.title}</h3>
				<p>{selectedDay.event.start} - {selectedDay.event.end}</p>
				<p>{selectedDay.event.description}</p>
				<p>{selectedDay.event.name}</p>
			</div>
		{/if}
		<button on:click={openAddEvent}>Add Event</button>
		{#if showAddEvent}
			<div class="dialog">
				<h3>Add Event</h3>
				<input bind:value={eventTitle} placeholder="Title" />
				<input type="time" bind:value={eventStart} placeholder="Start Time" />
				<input type="time" bind:value={eventEnd} placeholder="End Time" />
				<textarea bind:value={eventDescription} placeholder="Description" />
				<input bind:value={eventName} placeholder="Name (Optional)" />
				<button on:click={closeAddEvent}>Close</button>
				<button on:click={saveEvent}>Save</button>
			</div>
		{/if}
	</div>
{:else}
	<div>
		<button on:click={() => updateMonth(getPrevMonth(date))}>Previous</button>
		<button on:click={() => updateMonth(getNextMonth(date))}>Next</button>
	</div>

	<h2>{date.toLocaleString('default', { month: 'long' })} {date.getFullYear()}</h2>

	{#if monthData}
		<div class="calendar">
			{#each monthData as day, index (index)}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div class="day" on:click={() => selectDay(day)}>
					<h3>{day.date.getDate()}</h3>
					<p>{day.details}</p>
					{#if day.event}
						<div>
							<h4>{day.event.title}</h4>
							<p>{day.event.start} - {day.event.end}</p>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
{/if}

<style>
	/* Add your styles here */
	.calendar {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
	}
	.day {
		cursor: pointer;
	}
	.full-screen {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: white;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.dialog {
		position: absolute;
		width: 300px;
		padding: 20px;
		background: white;
		border: 1px solid #ccc;
	}
</style>
