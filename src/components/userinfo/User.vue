<template>
	<div>
		<x-header>账户信息</x-header>
		<div class="container">
			<group label-width="4.5em" label-margin-right="2em" label-align="left">
				<cell title="操作员" :value="user.name" value-align="left"></cell>
				<cell title="所属机构" :value="user.customerName" value-align="left"></cell>
				<cell title="状态" :value="user.isEnableName" value-align="left"></cell>
			</group>
			<group label-width="4.5em" label-margin-right="2em" label-align="left">
				<cell title="级别" :value="user.isAdminName" value-align="left"></cell>
				<cell title="职务" :value="user.job" value-align="left"></cell>
			</group>
			<group label-width="4.5em" label-margin-right="2em" label-align="left">
				<cell title="电话" :value="user.mobile" value-align="left"></cell>
				<cell title="邮箱" :value="user.account" value-align="left"></cell>
				<x-textarea title="备注" class="sub-item" :show-counter="false" :rows="5" :value="user.memo" readonly></x-textarea>
			</group>
		</div>
    	<toast v-model="showWarning" type="warn">{{message}}</toast>
	</div>
</template>

<script>
	import { Cell, CellBox, Group, XTextarea, Toast, XHeader } from 'vux'
	import user from "./user.json"
	export default {
		mounted() {
		},
		components: {
			Group,
			Cell,
			CellBox,
			XTextarea,
			Toast,
			XHeader
		},
		data() {
			return {
				showWarning:false,
				message:'',
				user: {}
			}
		},
		beforeMount(){
			this.user = user.data;
		}
	}
</script>
<style lang="less">
	@import '~vux/src/styles/reset.less';

	.container {
		width: 100%; 
		position: absolute;
		top: 44px;
		bottom: 0px;
		left: 0px;
		overflow: scroll;
		background: #ECECEC;
	}
</style>